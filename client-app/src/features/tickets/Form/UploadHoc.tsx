import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import MessageComponent from '../../../app/common/message/MessageComponent';
import PhotoWidgetDropzone from '../../../app/common/photoUpload/PhotoWidgetDropzone';
import { returnBlobFromFile } from '../../utils/helperMethods';
import TicketPhotoContainer from './TicketPhotoContainer';
interface IProps {
  setFilesForForm?: (file: any[]) => void;
  addFile: (...args: any) => Promise<void>;
  LIMIT_FILESIZE: number;
  LIMIT_FILETYPE: string[];
  toobig_message: string[];
  badfile_message: string;
  ticketId: string;
  buttonText: string;
  isAddingItem: boolean;
  isPreview: boolean;
}
const UploadHoc: React.FC<IProps> = ({
  LIMIT_FILESIZE,
  LIMIT_FILETYPE,
  toobig_message,
  badfile_message,
  ticketId,
  buttonText,
  isAddingItem,
  isPreview,
  addFile,
  setFilesForForm,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isItemTooBig, setIsItemTooBig] = useState(false);
  const [isBadFileType, setIsBadFileType] = useState(false);
  const [isMoreThanOne, setIsMoreThanOne] = useState(false);

  const handleFileSetting = (val: any) => {
    let isTooBig = false;
    let isBadFile = false;
    if (val.length > 1) {
      setIsMoreThanOne(true);
      setFiles([]);
      if (setFilesForForm) setFilesForForm([]);
      return;
    }
    val.forEach((item: any) => {
      if (item.size > LIMIT_FILESIZE) {
        isTooBig = true;
        setFiles([]);
        if (setFilesForForm) setFilesForForm([]);
        return;
      }

      if (!LIMIT_FILETYPE.includes(item.type)) {
        isBadFile = true;
        setFiles([]);
        if (setFilesForForm) setFilesForForm([]);
        setIsBadFileType(true);
      }
    });

    if (!isTooBig && !isBadFile) {
      setFiles(val);
      if (setFilesForForm) setFilesForForm(val);
    } else {
      if (isBadFile) setIsBadFileType(true);
      if (isTooBig) setIsItemTooBig(true);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <PhotoWidgetDropzone setFiles={handleFileSetting} isTicket={true}>
        <Button
          type='button'
          size='tiny'
          style={{
            border: '2px rgba(255,255,255, 0.6) dashed',
            marginTop: '10px',
            color: 'white',
            backgroundColor: '#bc4123',
          }}
          fluid={true}
          onClick={() => {
            setIsMoreThanOne(false);
            setIsItemTooBig(false);
            setIsBadFileType(false);
          }}
        >
          <div>
            {buttonText}
            <Icon name='upload' size='large' style={{ marginLeft: '2px' }} />
          </div>
        </Button>
      </PhotoWidgetDropzone>
      {isMoreThanOne && (
        <MessageComponent
          status={true}
          header={'Too many files.'}
          message={'Upload one file at a time.'}
        />
      )}
      {isItemTooBig && (
        <MessageComponent
          status={true}
          header={toobig_message[0]}
          message={toobig_message[1]}
        />
      )}
      {isBadFileType && (
        <MessageComponent
          status={true}
          header={'Sorry, that filetype is not accepted.'}
          message={badfile_message}
        />
      )}
      {files.length > 0 &&
        !isItemTooBig &&
        !isBadFileType &&
        (buttonText !== 'Add TextFile' ? (
          <TicketPhotoContainer
            photos={files}
            setFiles={setFiles}
            setFilesForForm={setFilesForForm}
          />
        ) : (
          <TicketPhotoContainer
            texts={files}
            setFiles={setFiles}
            setFilesForForm={setFilesForForm}
          />
        ))}
      {isPreview && files.length > 0 && !isItemTooBig && !isBadFileType && (
        <Button
          style={{ marginTop: '10px' }}
          positive
          content='submit'
          loading={isAddingItem}
          onClick={async () => {
            await addFile!(ticketId, await returnBlobFromFile(files));
            setFiles([]);
          }}
        />
      )}
    </div>
  );
};

export default UploadHoc;
