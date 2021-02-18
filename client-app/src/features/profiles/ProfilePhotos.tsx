import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';

import { useStore } from '../../app/stores/store';

const ProfilePhotos = () => {
  const { profileStore } = useStore();
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loadingMainPhotoSet,
    deletePhoto,
  } = profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );
  const handleUploadImage = async (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };
  return (
    <Tab.Pane
      style={{
        backgroundColor: 'rgb(7, 20, 38)',
        border: 'none',
      }}
    >
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            icon='image'
            content='photos'
            style={{ color: 'white', backgroundImage: 'white' }}
          />
          {isCurrentUser && (
            <Button
              floated='right'
              style={{
                backgroundColor: '#bc4123',
                color: 'white',
              }}
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16} style={{ color: 'white' }}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
              isGroup={false}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid width={2}>
                        <Button
                          name={photo.id}
                          loading={loadingMainPhotoSet && target === photo.id}
                          basic
                          positive
                          content='Main'
                          onClick={(e) => {
                            setTarget(e.currentTarget.name);
                            setMainPhoto(photo);
                          }}
                          disabled={photo.isMain}
                        />
                        <Button
                          name={photo.id}
                          disabled={photo.isMain}
                          loading={
                            loadingMainPhotoSet && deleteTarget === photo.id
                          }
                          onClick={(e) => {
                            deletePhoto(photo);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          basic
                          negative
                          icon='trash'
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
