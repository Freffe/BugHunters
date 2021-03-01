import React from 'react';
import {
  Grid,
  Header,
  Segment,
  Image,
  Popup,
  Button,
  GridColumn,
} from 'semantic-ui-react';

interface IProps {
  groupId: string;
  deletePhoto: (...args: any) => void;
  groupName: string;
  photo?: { id?: string; url?: string };
  isHostOrAdminOfGroup: boolean;
  loadingGroupPhoto: boolean;
  setIsAddingPhoto: (flag: boolean) => void;
  isAddingPhoto: boolean;
  deletingGroupPhoto: boolean;
}

const GroupDetailsHeader: React.FC<IProps> = ({
  groupId,
  deletePhoto,
  groupName,
  photo,
  isHostOrAdminOfGroup,
  loadingGroupPhoto,
  deletingGroupPhoto,
  setIsAddingPhoto,
  isAddingPhoto,
}) => {
  return (
    <Segment
      basic
      style={{
        marginTop: '0px',
        marginBottom: '0px',
        padding: '0px',
        backgroundColor: 'rgb(7, 20, 38)',
      }}
    >
      <Grid columns='two'>
        <Grid.Column textAlign='left' width={4}>
          <Header floated='left' as='h2' style={{ marginRight: '0px' }}>
            <Image
              style={{
                margin: '0px',
                marginRight: '2px',
                width: '73px',
                height: '73px',
                border: '1px solid rgb(255, 255, 255, 0.5)',
              }}
              rounded
              src={photo?.url || '/assets/user.png'}
            />
          </Header>

          {isHostOrAdminOfGroup && (
            <Grid.Row textAlign='left'>
              {photo?.url && (
                <Grid.Column>
                  <Popup
                    header={'Delete Group Photo'}
                    trigger={
                      <Button
                        style={{
                          border: '1px solid black',
                          fontSize: 'small',
                          marginLeft: '0px',
                          marginRight: '0px',
                        }}
                        negative
                        icon='cancel'
                        onClick={() => {
                          deletePhoto(groupId, photo);
                        }}
                        loading={deletingGroupPhoto}
                      />
                    }
                  />
                </Grid.Column>
              )}
              {!photo?.url && (
                <Grid.Column>
                  <Popup
                    header={'Add Group Photo'}
                    trigger={
                      <Button
                        style={{
                          border: '1px solid black',
                          fontSize: 'small',
                          marginTop: '2px',
                          marginLeft: '0px',
                          marginRight: '0px',
                        }}
                        positive
                        icon='add'
                        onClick={() => {
                          setIsAddingPhoto(!isAddingPhoto);
                        }}
                        loading={loadingGroupPhoto}
                      />
                    }
                  />
                </Grid.Column>
              )}
            </Grid.Row>
          )}
        </Grid.Column>
        <GridColumn>
          <Header
            as='h1'
            style={{
              marginTop: '0px',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {groupName}
          </Header>
        </GridColumn>
      </Grid>
    </Segment>
  );
};

export default GroupDetailsHeader;
