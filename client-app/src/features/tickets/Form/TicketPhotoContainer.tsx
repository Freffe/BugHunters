import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Grid, Segment, Image, Button, Icon, Popup } from 'semantic-ui-react';
import { ITicketPhoto, ITicketText } from '../../../app/models/tickets';
import { useStore } from '../../../app/stores/store';
import PhotoModal from '../Details/PhotoModal';

const TicketPhotoContainer: React.FC<{
  photos?: ITicketPhoto[] | undefined;
  texts?: ITicketText[] | undefined;
  setFiles?: (list: any[]) => void;
  setFilesForForm?: (list: any[]) => void;
}> = ({ photos, setFiles, setFilesForForm, texts }) => {
  const { ticketStore } = useStore();
  const {
    isTicketCreatorOrAdmin,
    selectedTicket,
    deletePhoto,
    deleteTextFile,
    isDeletingPhoto,
    isDeletingText,
  } = ticketStore;

  const [idForSelectedImg, setIdForSelectedImg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = (files: any[], isText: boolean) => {
    return (
      files!.length > 0 && (
        <Grid.Row
          fluid='true'
          columns={
            files!.length as
              | 1
              | 2
              | 3
              | 4
              | 5
              | 6
              | 7
              | 8
              | 9
              | 10
              | 11
              | 12
              | 13
              | 14
              | 15
              | 16
              | undefined
          }
        >
          {files?.map((img, i) => (
            <Grid.Column key={i} fluid='true'>
              <Segment compact style={{ position: 'relative' }}>
                {!isText && (
                  <div style={{ margin: 'auto' }}>
                    <Image
                      src={img.url ? img.url : img.preview}
                      id={i}
                      width='200px'
                      height='200px'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setIsModalOpen(true);
                        setIdForSelectedImg(img.id);
                      }}
                    />
                    <p style={{ textAlign: 'center', color: 'black' }}>
                      {img.name}
                    </p>
                  </div>
                )}
                {isText && (
                  <div style={{ margin: 'auto' }}>
                    <Icon
                      name='file outline'
                      size='massive'
                      style={{ marginLeft: '2px', cursor: 'pointer' }}
                      onClick={() => {
                        //openInNewTab(img.url ? img.url : img.preview)
                        setIsModalOpen(true);
                        setIdForSelectedImg(img.id);
                      }}
                    />
                    <p style={{ textAlign: 'center', color: 'black' }}>
                      {img.name}
                    </p>
                    <PhotoModal
                      img={img}
                      isOpen={isModalOpen}
                      id={idForSelectedImg}
                      setIsModalOpen={setIsModalOpen}
                      isPhoto={false}
                    />
                  </div>
                )}
                {isTicketCreatorOrAdmin && (
                  <Popup
                    header={'Delete this attachement.'}
                    trigger={
                      <Button
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          border: '1px solid black',
                        }}
                        negative
                        icon='remove'
                        size='mini'
                        loading={
                          (isDeletingPhoto || isDeletingText) &&
                          idForSelectedImg === img.id
                        }
                        onClick={() => {
                          setIdForSelectedImg(img.id);
                          handleOnClick(isText, img);
                        }}
                      />
                    }
                  />
                )}
                {!isText && (
                  <PhotoModal
                    img={img}
                    isOpen={isModalOpen}
                    id={idForSelectedImg}
                    setIsModalOpen={setIsModalOpen}
                    isPhoto={true}
                  />
                )}
              </Segment>
            </Grid.Column>
          ))}
        </Grid.Row>
      )
    );
  };

  const handleOnClick = async (isText: boolean, img?: any) => {
    if (img.id) {
      if (!isText) {
        await deletePhoto(selectedTicket!.id, img.id);
      } else {
        await deleteTextFile(selectedTicket!.id, img.id);
      }
    } else {
      setFiles!([]);
      if (setFilesForForm) setFilesForForm([]);
    }
  };
  return (
    <>
      <Grid style={{ paddingTop: '10px' }}>
        {photos && renderContent(photos, false)}
        {texts && renderContent(texts, true)}
      </Grid>
    </>
  );
};

export default observer(TicketPhotoContainer);
