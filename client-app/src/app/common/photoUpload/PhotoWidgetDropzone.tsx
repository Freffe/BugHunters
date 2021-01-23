import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon, Button } from 'semantic-ui-react';

interface IProps {
  setFiles: (files: object[]) => void;
  isTicket?: boolean;
  children?: React.ReactNode;
}

const dropzoneStyles = {
  border: 'dashed 3px',
  borderColor: '#eee',
  borderRadius: '5px',
  paddingTop: '30px',
  textAlign: 'center' as 'center',
  height: '200px',
};
const dropzoneActive = {
  borderColor: 'green',
};

const ticketButton = {
  borderColor: '#979797',
  borderRadius: '1px',
  width: '133px',
  textAlign: 'center' as 'center',
};

const PhotoWidgetDropzone: React.FC<IProps> = ({
  setFiles,
  isTicket,
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      setFiles(
        acceptedFiles.map((file: object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isTicket
          ? { ...ticketButton }
          : isDragActive
          ? { ...dropzoneStyles, ...dropzoneActive }
          : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      {isTicket ? (
        children
      ) : (
        <>
          <Icon name='upload' size='huge' />
          <Header content='Drop image here' />
        </>
      )}
    </div>
  );
};

export default PhotoWidgetDropzone;
