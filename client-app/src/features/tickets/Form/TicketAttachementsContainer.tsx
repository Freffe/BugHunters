import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Grid, Segment, Image, Button, Icon, Popup } from 'semantic-ui-react';
import { ITicketPhoto, ITicketText } from '../../../app/models/tickets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import PhotoModal from '../Details/PhotoModal';

const TicketAttachementsContainer: React.FC<{
  photos?: ITicketPhoto[] | undefined;
  texts?: ITicketText[] | undefined;
  setFiles?: (list: any[]) => void;
  setFilesForForm?: (list: any[]) => void;
}> = ({ photos, setFiles, setFilesForForm, texts }) => {
  const { ticketStore } = useContext(RootStoreContext);
  const {
    isTicketCreatorOrAdmin,
    selectedTicket,
    deletePhoto,
    deleteTextFile,
    isDeletingPhoto,
    isDeletingText,
    setTicketFiles,
  } = ticketStore;

  const [idForSelectedImg, setIdForSelectedImg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  let renderFiles = photos ? photos : texts;
  console.log(renderFiles);
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
          {files?.map((img: any, i: number) => (
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
                        img.id = img.id ? img.id : i.toString();
                        setIdForSelectedImg(img.id);
                        setIsModalOpen(true);
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
                      isPhoto={true}
                    />
                  </div>
                )}

                {isText && (
                  <div style={{ margin: 'auto' }}>
                    <Icon
                      name='file outline'
                      size='massive'
                      style={{ marginLeft: '2px', cursor: 'pointer' }}
                      onClick={() => {
                        img.id = img.id ? img.id : i.toString();
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
                          console.log('IMG ID: ', img.id);
                          setIdForSelectedImg(
                            img.id ? img.id : (img.id = i.toString())
                          );
                          handleOnClick(isText, img);
                        }}
                      />
                    }
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
    if (img.id.length > 2) {
      // Then this image is hosted on cloudinary.
      if (!isText) {
        await deletePhoto(selectedTicket!.id, img.id);
      } else {
        await deleteTextFile(selectedTicket!.id, img.id);
      }
    } else {
      let newFiles = new Array(renderFiles!.length - 1);

      for (var i = 0; i < renderFiles?.length!; i++) {
        if (i === parseInt(img.id)) {
        } else {
          if (renderFiles![i]) newFiles[i] = renderFiles![i];
        }
      }

      //setIdForSelectedImg((newFiles.size - 1).toString());
      console.log('newFiles: ', newFiles);
      setFiles!(newFiles);
      setTicketFiles(newFiles);
      //if (setFilesForForm) setFilesForForm(newFiles);
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

export default observer(TicketAttachementsContainer);
