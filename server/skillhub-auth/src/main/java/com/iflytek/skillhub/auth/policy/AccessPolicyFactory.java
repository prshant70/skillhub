package com.iflytek.skillhub.auth.policy;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Builds the active external-access policy from configuration properties.
 */
@Configuration
@ConfigurationProperties(prefix = "skillhub.access-policy")
public class AccessPolicyFactory {
    private String mode = "OPEN";
    private List<String> allowedEmailDomains = List.of();
    private List<String> allowedProviders = List.of();
    private List<String> whitelistedSubjects = List.of();

    @Bean
    public AccessPolicy accessPolicy() {
        return switch (mode.toUpperCase()) {
            case "EMAIL_DOMAIN" -> new EmailDomainAccessPolicy(normalizedDomains());
            case "PROVIDER_ALLOWLIST" -> new ProviderAllowlistAccessPolicy(Set.copyOf(allowedProviders));
            case "SUBJECT_WHITELIST" -> new SubjectWhitelistAccessPolicy(Set.copyOf(whitelistedSubjects));
            default -> new OpenAccessPolicy();
        };
    }

    /**
     * The policy compares against a lower-cased domain, so configured values are
     * normalized here. Without this, a value such as "1MG.com" silently denies
     * every login with no error anywhere. Blanks are dropped so an unset
     * comma-separated environment variable yields an empty set rather than "".
     */
    private Set<String> normalizedDomains() {
        return allowedEmailDomains.stream()
            .filter(domain -> domain != null && !domain.isBlank())
            .map(domain -> domain.trim().toLowerCase(Locale.ROOT))
            .collect(Collectors.toUnmodifiableSet());
    }

    public void setMode(String mode) { this.mode = mode; }
    public void setAllowedEmailDomains(List<String> d) { this.allowedEmailDomains = d; }
    public void setAllowedProviders(List<String> p) { this.allowedProviders = p; }
    public void setWhitelistedSubjects(List<String> s) { this.whitelistedSubjects = s; }
}
