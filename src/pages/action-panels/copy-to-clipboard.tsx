import { ActionPanel, copyTextToClipboard, Icon, showToast, ToastStyle } from "@raycast/api"

const copyToClipboard = async (text: string) => {
    await copyTextToClipboard(text)
    showToast(ToastStyle.Success, "Copied to clipboard")
}

const CopyToClipboardActionPanel = ({ text }: { text?: string }) => {
    return (<ActionPanel>
        <ActionPanel.Item
            title="Copy to Clipboard"
            onAction={() => copyToClipboard(text ?? '')}
            icon={Icon.Document}
        />
    </ActionPanel>)
}

export default CopyToClipboardActionPanel
