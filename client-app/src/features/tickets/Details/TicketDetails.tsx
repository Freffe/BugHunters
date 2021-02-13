import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Accordion, Grid, Icon, List } from 'semantic-ui-react';
import { ITicket } from '../../../app/models/tickets';
import TicketPhotoContainer from '../Form/TicketPhotoContainer';
import UploadHoc from '../Form/UploadHoc';

const LIMIT_TEXTFILESIZE = 10000;
const LIMIT_TEXTFILETYPE = ['text/plain'];

const LIMIT_FILESIZE = 500000;
const LIMIT_FILETYPE = ['image/jpeg', 'image/png', 'image/jpg'];

interface IProps {
  ticket: ITicket;
  isTicketCreatorOrAdmin: boolean;
  addTextFile: (ticketId: string, text: Blob) => Promise<void>;
  addPhoto: (ticketId: string, photo: Blob) => Promise<void>;
  isAddingPhoto: boolean;
  isAddingText: boolean;
}
const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const TicketPreview: React.FC<{ ticket: ITicket }> = ({ ticket }) => {
  return (
    <List>
      {Object.entries(ticket).map(
        ([oKey, oValue], i) =>
          ['status', 'version', 'priority', 'bugType', 'device'].includes(
            oKey
          ) && (
            <List.Item key={i}>
              <p>
                <b>{capitalizeFirstLetter(oKey)}</b>: {oValue}
              </p>
            </List.Item>
          )
      )}
    </List>
  );
};

const TicketDetails: React.FC<IProps> = ({
  ticket,
  isTicketCreatorOrAdmin,
  addTextFile,
  addPhoto,
  isAddingPhoto,
  isAddingText,
}) => {
  const [activeIndex, setActiveIndex] = useState([true, true, true]);
  const handleClick = (e: any, titleProps: any) => {
    if (titleProps.index === 0) {
      setActiveIndex([!activeIndex[0], activeIndex[1], activeIndex[2]]);
    } else if (titleProps.index === 1) {
      setActiveIndex([activeIndex[0], !activeIndex[1], activeIndex[2]]);
    } else {
      setActiveIndex([activeIndex[0], activeIndex[1], !activeIndex[2]]);
    }
  };
  console.log('RENDERING TICKETDETAILS');

  return (
    <Grid>
      <Grid.Column width={16}>
        <Accordion exclusive={false} fluid>
          <Accordion.Title
            active={activeIndex[0] === true}
            index={0}
            onClick={handleClick}
          >
            <p>
              <Icon name='dropdown' />
              Details
            </p>
          </Accordion.Title>
          <Accordion.Content active={activeIndex[0] === true}>
            <TicketPreview ticket={ticket} />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex[1] === true}
            index={1}
            onClick={handleClick}
          >
            <p>
              <Icon name='dropdown' />
              Description
            </p>
          </Accordion.Title>
          <Accordion.Content active={activeIndex[1] === true}>
            <List>
              <List.Item>
                <p>{ticket.description}</p>
              </List.Item>
            </List>
          </Accordion.Content>
          {(ticket.photos!.length || ticket.texts!.length) > 0 && (
            <>
              <Accordion.Title
                active={activeIndex[2] === true}
                index={2}
                onClick={handleClick}
              >
                <p>
                  <Icon name='dropdown' />
                  Attachements
                </p>
              </Accordion.Title>
              <Accordion.Content active={activeIndex[2] === true}>
                <TicketPhotoContainer
                  photos={ticket.photos!}
                  texts={ticket.texts}
                />
              </Accordion.Content>
            </>
          )}
        </Accordion>
        {
          isTicketCreatorOrAdmin && (
            <UploadHoc
              isPreview={true}
              LIMIT_FILESIZE={LIMIT_FILESIZE}
              LIMIT_FILETYPE={LIMIT_FILETYPE}
              ticketId={ticket.id}
              buttonText='Add Photo'
              isAddingItem={isAddingPhoto}
              addFile={addPhoto}
              toobig_message={[
                `Sorry that file is too big.`,
                `Maximum size is ${LIMIT_FILESIZE} kb.`,
              ]}
              badfile_message='Change filetype to image/jpeg or image/png.'
            />
          )
          // <TicketUploadPhoto isPreview={true} />
        }
        {isTicketCreatorOrAdmin && (
          <UploadHoc
            isPreview={true}
            LIMIT_FILESIZE={LIMIT_TEXTFILESIZE}
            LIMIT_FILETYPE={LIMIT_TEXTFILETYPE}
            ticketId={ticket.id}
            buttonText='Add TextFile'
            isAddingItem={isAddingText}
            addFile={addTextFile}
            toobig_message={[
              'Sorry that file is too big.',
              'Maximum size of a .txt is 10kb',
            ]}
            badfile_message='Change filetype to text/plain or .txt'
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(TicketDetails);
