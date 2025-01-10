{
    // Extract all links from the current page
    const jiraLinkQuery = document.querySelectorAll("table[aria-label='Issues'] tr td a[data-testid='native-issue-table.common.ui.issue-cells.issue-key.issue-key-cell']")
    // Limit length of array to 50
    jiraLinkQuery.length = 50;
    const links = Array.from(jiraLinkQuery)
        .filter((a) => a.href) // Only include links with href attributes
        .map((a) => ({
            text: a.textContent.trim() || "Couldn't find link",
            href: a.href
        }));

    const jiraSummaryQuery = document.querySelectorAll("table[aria-label='Issues'] tr td a[data-testid='native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell']")
    // Limit length of array to 50
    jiraSummaryQuery.length = 50;
    const summaries = Array.from(jiraSummaryQuery)
        .filter((a) => a.href) // Only include links with href attributes
        .map((a) => ({
            text: a.textContent.trim() || "Couldn't find text",
        }));


    if (links.length > 0 && summaries.length > 0) {
        // Format the links for HTML
        const formattedLinks = links
            .map((link, index) => `<li><a href="${link.href}">${link.text}</a> - ${summaries[index].text}</li>`)
            .join("");

        let formattedLinksHTML = `<body><ol>${formattedLinks}<ol></body>`

        // Write the HTML to the clipboard
        const clipboardItem = new ClipboardItem({
            "text/html": new Blob([formattedLinksHTML], { type: "text/html" }),
            "text/plain": new Blob(
                [links.map((link, index) => `${link.text}: ${link.href}`).join("\n")],
                { type: "text/plain" }
            )
        });
        // Copy the formatted links to the clipboard
        navigator.clipboard.write([clipboardItem]).then(() => {
            // Send a message to the background script to create a notification
            chrome.runtime.sendMessage({
                type: "show_notification",
                title: "Jira Links Copied",
                message: "Jira Links have been copied to the clipboard with formatting!"
            });
        }).catch((err) => {
            console.error("Failed to copy links to clipboard:", err);
        });
    } else {
        // Notify the user that no links were found
        chrome.runtime.sendMessage({
            type: "show_notification",
            title: "No Jira Links Found",
            message: "No Jira links were found on this page."
        });
    }
}