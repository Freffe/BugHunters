import React, { useState } from 'react';
import { Grid, Segment, Image } from 'semantic-ui-react';
import { ITicketPhoto } from '../../../app/models/tickets';

const TicketPhotoContainer: React.FC<{
  photos: ITicketPhoto[] | undefined;
}> = ({ photos }) => {
  const [imageHeight, setImageHeight] = useState({ height: '140', id: '' });
  return (
    <>
      {photos!.length > 0 && (
        <Grid style={{ paddingTop: '10px' }}>
          <Grid.Row
            fluid='true'
            columns={
              photos!.length as
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
            {photos?.map((img, i) => (
              <Grid.Column key={i} fluid='true'>
                <Segment compact>
                  <Image
                    src={img.url}
                    height={
                      imageHeight.id === img.url! ? imageHeight.height : '140'
                    }
                    width={
                      imageHeight.id === img.url! ? imageHeight.height : '140'
                    }
                    id={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      imageHeight.height !== '500'
                        ? setImageHeight({
                            height: '500',
                            id: img.url!,
                          })
                        : setImageHeight({
                            height: '140',
                            id: img.url!,
                          });
                    }}
                  />
                </Segment>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      )}
    </>
  );
};

export default TicketPhotoContainer;
