
package com.sahaayak.backend.service;

import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.Locale;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import com.sahaayak.backend.dto.LinkPreviewResponse;

@Service
public class LinkPreviewService {

    private static final int MAX_REDIRECTS = 5;
    private static final int TIMEOUT_MS = 8000;
    private static final int MAX_BODY_SIZE = 1024 * 1024;

    public LinkPreviewResponse getLinkPreview(String url) {

        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL is required.");
        }

        String originalUrl = url.trim();
        String currentUrl = originalUrl;

        try {
            for (int redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {

                // Validate every URL, including redirect destinations.
                validateUrl(currentUrl);

                Connection.Response response = Jsoup.connect(currentUrl)
                        .userAgent("Mozilla/5.0 SAHAAYAK-LinkPreview/1.0")
                        .timeout(TIMEOUT_MS)
                        .maxBodySize(MAX_BODY_SIZE)
                        .followRedirects(false)
                        .ignoreHttpErrors(true)
                        .execute();

                int status = response.statusCode();

                // Follow redirects manually so every destination
                // is validated before the next request.
                if (status >= 300 && status < 400) {

                    String location = response.header("Location");

                    if (location == null || location.isBlank()) {
                        throw new IllegalArgumentException(
                                "The website returned an invalid redirect.");
                    }

                    if (redirects == MAX_REDIRECTS) {
                        throw new IllegalArgumentException(
                                "Too many redirects while opening this link.");
                    }

                    currentUrl = URI.create(currentUrl)
                            .resolve(location)
                            .toString();

                    continue;
                }

                if (status < 200 || status >= 300) {
                    throw new IllegalArgumentException(
                            "The website could not be opened. HTTP status: "
                                    + status);
                }

                Document document = response.parse();

                return buildPreview(originalUrl, currentUrl, document);
            }

            throw new IllegalArgumentException(
                    "Unable to follow the website redirects.");

        } catch (IllegalArgumentException exception) {
            throw exception;

        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Unable to connect to this website. Please check the URL.",
                    exception);

        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Unable to generate preview for this link.",
                    exception);
        }
    }

    private LinkPreviewResponse buildPreview(
            String originalUrl,
            String pageUrl,
            Document document) {

        String title = getMetaContent(
                document,
                "meta[property=og:title]");

        if (title == null) {
            title = getMetaContent(
                    document,
                    "meta[name=twitter:title]");
        }

        if (title == null) {
            title = emptyToNull(document.title());
        }

        String description = getMetaContent(
                document,
                "meta[property=og:description]");

        if (description == null) {
            description = getMetaContent(
                    document,
                    "meta[name=description]");
        }

        if (description == null) {
            description = getMetaContent(
                    document,
                    "meta[name=twitter:description]");
        }

        String imageUrl = getMetaContent(
                document,
                "meta[property=og:image]");

        if (imageUrl == null) {
            imageUrl = getMetaContent(
                    document,
                    "meta[property=og:image:secure_url]");
        }

        if (imageUrl == null) {
            imageUrl = getMetaContent(
                    document,
                    "meta[name=twitter:image]");
        }

        if (imageUrl == null) {
            imageUrl = getMetaContent(
                    document,
                    "meta[name=twitter:image:src]");
        }

        if (imageUrl != null) {
            imageUrl = resolveImageUrl(pageUrl, imageUrl);
        }

        String siteName = getMetaContent(
                document,
                "meta[property=og:site_name]");

        if (siteName == null) {
            siteName = URI.create(pageUrl).getHost();
        }

        return new LinkPreviewResponse(
                originalUrl,
                title,
                description,
                imageUrl,
                siteName);
    }

    private String getMetaContent(
            Document document,
            String selector) {

        String content = document.select(selector)
                .attr("content");

        return emptyToNull(content);
    }

    private String emptyToNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String resolveImageUrl(
            String pageUrl,
            String imageUrl) {

        try {
            URI resolved = URI.create(pageUrl)
                    .resolve(imageUrl.trim());

            String scheme = resolved.getScheme();

            if (scheme == null
                    || !(scheme.equalsIgnoreCase("http")
                            || scheme.equalsIgnoreCase("https"))) {
                return null;
            }

            return resolved.toString();

        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private void validateUrl(String url) {

        try {
            URI uri = URI.create(url.trim()).normalize();

            String scheme = uri.getScheme();
            String host = uri.getHost();

            if (!uri.isAbsolute()
                    || host == null
                    || scheme == null
                    || uri.getUserInfo() != null
                    || !(scheme.equalsIgnoreCase("http")
                            || scheme.equalsIgnoreCase("https"))) {

                throw new IllegalArgumentException(
                        "Only valid HTTP or HTTPS links are allowed.");
            }

            // Remove IPv6 brackets before resolving the address.
            if (host.startsWith("[") && host.endsWith("]")) {
                host = host.substring(1, host.length() - 1);
            }

            String normalizedHost = host.toLowerCase(Locale.ROOT);

            if (normalizedHost.equals("localhost")
                    || normalizedHost.endsWith(".localhost")
                    || normalizedHost.endsWith(".local")
                    || normalizedHost.endsWith(".internal")
                    || normalizedHost.equals("metadata.google.internal")) {

                throw new IllegalArgumentException(
                        "This URL is not allowed.");
            }

            InetAddress[] addresses = InetAddress.getAllByName(host);

            for (InetAddress address : addresses) {

                if (isPrivateOrRestrictedAddress(address)) {
                    throw new IllegalArgumentException(
                            "Links to private network addresses are not allowed.");
                }
            }

        } catch (UnknownHostException exception) {

            throw new IllegalArgumentException(
                    "Unable to resolve the website address.");

        } catch (IllegalArgumentException exception) {
            throw exception;

        } catch (Exception exception) {

            throw new IllegalArgumentException(
                    "Invalid URL.");
        }
    }

    private boolean isPrivateOrRestrictedAddress(
            InetAddress address) {

        if (address.isAnyLocalAddress()
                || address.isLoopbackAddress()
                || address.isLinkLocalAddress()
                || address.isSiteLocalAddress()
                || address.isMulticastAddress()) {
            return true;
        }

        byte[] bytes = address.getAddress();

        // Block IPv6 unique-local addresses (fc00::/7).
        if (bytes.length == 16 && (bytes[0] & 0xFE) == 0xFC) {
            return true;
        }

        // Block IPv4 shared/private and reserved ranges.
        if (bytes.length == 4) {
            int first = bytes[0] & 0xFF;
            int second = bytes[1] & 0xFF;

            return first == 0
                    || first == 100 && second >= 64 && second <= 127
                    || first >= 224;
        }

        return false;
    }
}
