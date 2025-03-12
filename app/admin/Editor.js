import "@fortawesome/fontawesome-free/css/all.css";
import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

export default function Editor({ textareaValue, setTextareaValue }) {
  const [editorLoaded, setEditorLoaded] = useState(false);

  const config = {
    language: "zh_tw",
    height: 300,
    toolbarButtons: ["fontSize", "align", "formatOL", "formatUL", "bold", "italic", "underline", "strikeThrough", "textColor", "backgroundColor", "insertTable", "emoticons", "html"],
    pluginsEnabled: ["table", "emoticons", "align", "colors", "fontSize", "lists"]
  };

  const handleModelChange = (model) => {
    setTextareaValue(model);
  };

  useLayoutEffect(() => {
    const loadResources = async () => {
      try {
        await Promise.all([
          import("froala-editor/js/plugins.pkgd.min.js"),
          import("froala-editor/js/froala_editor.pkgd.min.js"),
          import("froala-editor/css/froala_editor.pkgd.min.css"),
          import("froala-editor/js/languages/zh_tw.js"),
          import("froala-editor/js/plugins/image.min.js")
        ]);
        setEditorLoaded(true);
      } catch (error) {
        console.error("Error loading Froala Editor resources:", error);
      }
    };

    loadResources();
  }, []);

  if (!editorLoaded) {
    return <div>Loading editor...</div>; // 顯示加載中的狀態
  }

  return (
    <FroalaEditor
      tag="textarea"
      model={textareaValue}
      onModelChange={handleModelChange}
      config={config}
    />
  );
}
