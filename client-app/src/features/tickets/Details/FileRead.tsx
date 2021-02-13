import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';

const FileRead: React.FC<{ url: any }> = ({ url }) => {
  const [fileString, setFileString] = useState('');
  useEffect(() => {
    if (!fileString) {
      showFile();
    }
  }, []);

  const showFile = async () => {
    //e.preventDefault()
    try {
      const file = await fetch(
        url.url ? url.url : url.preview
      ).then((response) => response.arrayBuffer());

      const dataView = new DataView(file);
      //iso-8859-1
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(dataView);

      setFileString(decodedString);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {fileString ? fileString : <Loader />}
    </div>
  );
};

export default FileRead;
