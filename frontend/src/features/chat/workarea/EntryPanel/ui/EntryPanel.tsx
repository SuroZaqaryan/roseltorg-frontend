import {  ConfigProvider, theme } from "antd";

import FileViewer from "../../TaskTable/ui/FileViewer.tsx";
import { useChatStore } from "@stores/useChatStore";
import WelcomePrompts from "./WelcomePrompts";


const EntryPanel = () => {
  const { uploadedFile } = useChatStore();
  const hasFile = Boolean(uploadedFile?.name);

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      {hasFile ? <FileViewer /> : <WelcomePrompts />}
    </ConfigProvider>
  );
};

export default EntryPanel;
