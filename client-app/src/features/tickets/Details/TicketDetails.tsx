import React, { useState } from 'react';
import { Accordion, Grid, Icon, List } from 'semantic-ui-react';
import { ITicket } from '../../../app/models/tickets';
import TicketPhotoContainer from '../Form/TicketPhotoContainer';

interface IProps {
  ticket: ITicket;
}

const TicketPreview: React.FC<IProps> = ({ ticket }) => {
  return (
    <List>
      {Object.entries(ticket).map(
        ([oKey, oValue], i) =>
          ['status', 'version', 'priority', 'bugType', 'device'].includes(
            oKey
          ) && (
            <List.Item key={i}>
              <p>
                {oKey}: {oValue}
              </p>
            </List.Item>
          )
      )}
    </List>
  );
};

const TicketDetails: React.FC<IProps> = ({ ticket }) => {
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
  return (
    <Grid>
      <Grid.Column width={10}>
        <Accordion exclusive={false} fluid>
          <Accordion.Title
            active={activeIndex[0] === true}
            index={0}
            onClick={handleClick}
          >
            <p style={{ fontWeight: 'bold' }}>
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
            <p style={{ fontWeight: 'bold' }}>
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
          {ticket.photos!.length > 0 && (
            <>
              <Accordion.Title
                active={activeIndex[2] === true}
                index={2}
                onClick={handleClick}
              >
                <p style={{ fontWeight: 'bold' }}>
                  <Icon name='dropdown' />
                  Attachements
                </p>
              </Accordion.Title>
              <Accordion.Content active={activeIndex[2] === true}>
                <TicketPhotoContainer photos={ticket.photos!} />
              </Accordion.Content>
            </>
          )}
        </Accordion>
      </Grid.Column>
    </Grid>
  );
};

export default TicketDetails;
