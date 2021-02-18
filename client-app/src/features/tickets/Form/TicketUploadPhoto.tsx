import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import MessageComponent from '../../../app/common/message/MessageComponent';
import PhotoWidgetDropzone from '../../../app/common/photoUpload/PhotoWidgetDropzone';
import { useStore } from '../../../app/stores/store';
import TicketAttachementsContainer from './TicketAttachementsContainer';

const LIMIT_FILESIZE = 500000;
const LIMIT_FILETYPE = ['image/jpeg', 'image/png', 'image/jpg'];

const LIMIT_FILESIZETEXT = 50000;
const LIMIT_FILETYPETEXT = ['text/plain', 'image/txt'];

const TicketUploadPhoto: React.FC<{
  isPreview: boolean;
  isPhoto?: boolean;
}> = ({ isPreview, isPhoto }) => {
  const { ticketStore } = useStore();
  const { isAddingPhoto, setTicketFiles } = ticketStore;
  const [files, setFiles] = useState<any[] | any>([]);
  const [isImageTooBig, setIsImageTooBig] = useState(false);
  const [isBadFileType, setIsBadFileType] = useState(false);

  const handleFileSetting = (val: any) => {
    let isTooBig = false;
    let isBadFile = false;
    let totalFileSize = 0;
    val.forEach((item: any) => {
      totalFileSize += item.size;
      if (
        isPhoto
          ? !LIMIT_FILETYPE.includes(item.type)
          : !LIMIT_FILETYPETEXT.includes(item.type)
      ) {
        console.log('Textfile: ', item);
        isBadFile = true;
        setFiles([]);
        setIsBadFileType(true);
        return;
      }
      if (item.size > (isPhoto ? LIMIT_FILESIZE : LIMIT_FILESIZETEXT)) {
        isTooBig = true;
        setFiles([]);
        return;
      }
    });

    if (totalFileSize > LIMIT_FILESIZE) {
      isTooBig = true;
      setFiles([]);
    }

    if (!isTooBig && !isBadFile) {
      setFiles(val);
      // This call destroys document and destroys blob url!
      //if (setFilesForForm) setFilesForForm(newMap); <--------
      setTicketFiles(val);
    } else {
      if (isBadFile) setIsBadFileType(true);
      if (isTooBig) setIsImageTooBig(true);
    }
  };

  return (
    <Container style={{ marginBottom: '10px' }} fluid>
      <PhotoWidgetDropzone setFiles={handleFileSetting} isTicket={true}>
        <Button
          type='button'
          size='tiny'
          style={{ border: '1px black dashed', marginTop: '10px' }}
          onClick={() => {
            setIsImageTooBig(false);
            setIsBadFileType(false);
          }}
          fluid
        >
          {isPhoto ? 'Add photo' : 'Add text'}
          <Icon name='upload' size='large' style={{ marginLeft: '2px' }} />
        </Button>
      </PhotoWidgetDropzone>
      {isImageTooBig && (
        <MessageComponent
          status={true}
          header={'Sorry your image is too big'}
          message={`Compress the image and try again. Size > ${LIMIT_FILESIZE} kb.`}
        />
      )}
      {isBadFileType && (
        <MessageComponent
          status={true}
          header={'Sorry that filetype is not accepted'}
          message={'Change filetype to image/jpg or image/png.'}
        />
      )}
      {files.length > 0 && !isImageTooBig && isPhoto! && !isBadFileType && (
        <TicketAttachementsContainer photos={files} setFiles={setFiles} />
      )}
      {files.length > 0 && !isImageTooBig && !isPhoto! && !isBadFileType && (
        <TicketAttachementsContainer texts={files} setFiles={setFiles} />
      )}
      {isPreview && files.length > 0 && !isImageTooBig && !isBadFileType && (
        <Button
          style={{ marginTop: '10px' }}
          positive
          content='submit'
          loading={isAddingPhoto}
          onClick={() => {
            setFiles([]);
          }}
        />
      )}
    </Container>
  );
};

export default observer(TicketUploadPhoto);
