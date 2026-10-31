
package com.sahaayak.backend.service;

import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import com.sahaayak.backend.dto.LinkPreviewResponse;

@Service
public class LinkPreviewService {

    public LinkPreviewResponse getLinkPreview(String url) {

        validateUrl(url);

        try {
            Connection connection = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 SAHAAYAK-LinkPreview/1.0")
                    .timeout(5000)
                    .maxBodySize(1024 * 1024)
                    .followRedirects(false)
                    .ignoreHttpErrors(true);

            Document document = connection.get();

            String title = getMetaContent(document,
                    "meta[property=og:title]");
            if (title == null) {
                title = document.title();
            }

            String description = getMetaContent(document,
                    "meta[property=og:description]");
            if (description == null) {
                description = getMetaContent(document,
                        "meta[name=description]");
            }

            String imageUrl = getMetaContent(document,
                    "meta[property=og:image]");

            if (imageUrl != null) {
                imageUrl = URI.create(url).resolve(imageUrl).toString();
            }

            String siteName = getMetaContent(document,
                    "meta[property=og:site_name]");

            return new LinkPreviewResponse(
                    url,
                    title,
                    description,
                    imageUrl,
                    siteName
            );

        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Unable to generate preview for this link."
            );
        }
    }

    private String getMetaContent(
            Document document,
            String selector) {

        String content = document.select(selector).attr("content");

        if (content == null || content.isBlank()) {
            return null;
        }

        return content.trim();
    }

    private void validateUrl(String url) {

        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException(
                    "URL is required."
            );
        }

        try {
            URI uri = URI.create(url.trim());

            String scheme = uri.getScheme();

            if (!uri.isAbsolute()
                    || uri.getHost() == null
                    || scheme == null
                    || !(scheme.equalsIgnoreCase("http")
                    || scheme.equalsIgnoreCase("https"))) {

                throw new IllegalArgumentException(
                        "Only valid HTTP or HTTPS links are allowed."
                );
            }

            String host = uri.getHost();

            if (host.equalsIgnoreCase("localhost")
                    || host.endsWith(".localhost")
                    || host.equalsIgnoreCase("metadata.google.internal")) {

                throw new IllegalArgumentException(
                        "This URL is not allowed."
                );
            }

            InetAddress[] addresses =
                    InetAddress.getAllByName(host);

            for (InetAddress address : addresses) {
                if (address.isAnyLocalAddress()
                        || address.isLoopbackAddress()
                        || address.isLinkLocalAddress()
                        || address.isSiteLocalAddress()
                        || address.isMulticastAddress()) {

                    throw new IllegalArgumentException(
                            "Links to private network addresses are not allowed."
                    );
                }
            }

        } catch (UnknownHostException exception) {
            throw new IllegalArgumentException(
                    "Unable to resolve the website address."
            );
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Invalid URL."
            );
        }
    }
}
