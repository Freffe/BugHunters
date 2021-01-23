import React, { useState } from 'react';
import { Button, Grid, Icon, Segment, Image } from 'semantic-ui-react';
import PhotoWidgetDropzone from '../../../app/common/photoUpload/PhotoWidgetDropzone';

const TicketUploadPhoto: React.FC<{
  setFilesForForm: (file: any[]) => void;
}> = ({ setFilesForForm }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [imageHeight, setImageHeight] = useState({ height: '140', id: '' });

  const handleFileSetting = (val: any) => {
    setFiles(val);
    setFilesForForm(val);
  };
  return (
    <div style={{ marginBottom: '10px' }}>
      <PhotoWidgetDropzone setFiles={handleFileSetting} isTicket={true}>
        <Button
          type='button'
          size='tiny'
          style={{ border: '1px black dashed' }}
          fluid={true}
          onClick={() => console.log('clicked')}
        >
          Add Photo
          <Icon name='upload' size='large' style={{ marginLeft: '2px' }} />
        </Button>
      </PhotoWidgetDropzone>
      {files.length > 0 && (
        <Grid style={{ paddingTop: '10px' }}>
          <Grid.Row
            fluid='true'
            columns={
              files.length as
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
                <Segment compact>
                  <Image
                    src={img.preview}
                    height={
                      imageHeight.id === img.preview!
                        ? imageHeight.height
                        : '140'
                    }
                    width={
                      imageHeight.id === img.preview!
                        ? imageHeight.height
                        : '140'
                    }
                    id={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      imageHeight.height !== '500'
                        ? setImageHeight({
                            height: '500',
                            id: img.preview!,
                          })
                        : setImageHeight({
                            height: '140',
                            id: img.preview!,
                          });
                    }}
                  />
                </Segment>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      )}
    </div>
  );
};

export default TicketUploadPhoto;
