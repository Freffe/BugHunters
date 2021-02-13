import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import MessageComponent from '../../../app/common/message/MessageComponent';
import PhotoWidgetDropzone from '../../../app/common/photoUpload/PhotoWidgetDropzone';
import { RootStoreContext } from '../../../app/stores/rootStore';
import TicketAttachementsContainer from './TicketAttachementsContainer';
import TicketPhotoContainer from './TicketPhotoContainer';

const LIMIT_FILESIZE = 500000;
const LIMIT_FILETYPE = ['image/jpeg', 'image/png', 'image/jpg'];

const LIMIT_FILESIZETEXT = 50000;
const LIMIT_FILETYPETEXT = ['text/plain', 'image/txt'];

const TicketUploadPhoto: React.FC<{
  setFilesForForm?: (file: any[] | any) => void;
  isPreview: boolean;
  isPhoto?: boolean;
}> = ({ setFilesForForm, isPreview, isPhoto }) => {
  const { ticketStore } = useContext(RootStoreContext);
  const { isAddingPhoto, setTicketFiles } = ticketStore;
  const [files, setFiles] = useState<any[] | any>([]);
  const [isImageTooBig, setIsImageTooBig] = useState(false);
  const [isBadFileType, setIsBadFileType] = useState(false);

  const handleFileSetting = (val: any) => {
    let isTooBig = false;
    let isBadFile = false;
    console.log('VAL: ', val);
    val.forEach((item: any) => {
      if (item.size > (isPhoto ? LIMIT_FILESIZE : LIMIT_FILESIZETEXT)) {
        console.log('Setting too big1');
        isTooBig = true;
        setFiles([]);
        if (setFilesForForm) setFilesForForm([]);
        return;
      }

      if (
        isPhoto
          ? !LIMIT_FILETYPE.includes(item.type)
          : !LIMIT_FILETYPETEXT.includes(item.type)
      ) {
        console.log('Textfile: ', item);
        isBadFile = true;
        setFiles([]);
        if (setFilesForForm) setFilesForForm([]);
        setIsBadFileType(true);
      }
    });

    if (!isTooBig && !isBadFile) {
      console.log('newMap: ', val);
      setFiles(val);
      // This call destroys document and destroys blob url!
      //if (setFilesForForm) setFilesForForm(newMap); <--------
      setTicketFiles(val);
    } else {
      if (isBadFile) setIsBadFileType(true);
      if (isTooBig) setIsImageTooBig(true);
    }
  };
  console.log('files are: ', files.size);
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
        >
          {isPhoto ? 'Add Photo' : 'Add Text'}
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
        <TicketAttachementsContainer
          photos={files}
          setFiles={setFiles}
          setFilesForForm={setFilesForForm}
        />
      )}
      {files.length > 0 && !isImageTooBig && !isPhoto! && !isBadFileType && (
        <TicketAttachementsContainer
          texts={files}
          setFiles={setFiles}
          setFilesForForm={setFilesForForm}
        />
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
