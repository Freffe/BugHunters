import React, { useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { ITicket, TicketFormValues } from '../../../app/models/tickets';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import TicketUploadPhoto from './TicketUploadPhoto';
import { useStore } from '../../../app/stores/store';

// requirement fields for validation in form.
const required = (value: any) => (value ? undefined : 'Required');
const minLength = (min: any) => (value: any) =>
  value.length > min || value >= min
    ? undefined
    : `Should be atleast ${min} characters long.`;
const composeValidators = (...validators: any) => (value: string) =>
  validators.reduce(
    (error: any, validator: any) => error || validator(value),
    undefined
  );

const priorityOptions = [
  { key: 'Low', value: 'low', text: 'Low' },
  { key: 'Medium', value: 'medium', text: 'Medium' },
  { key: 'High', value: 'high', text: 'High' },
];

const statusOptions = [
  { key: 'Open', value: 'open', text: 'Open' },
  { key: 'Verify', value: 'verify', text: 'Ready for verification' },
  { key: 'Closed', value: 'closed', text: 'Closed' },
];

const paragraphStyles = {
  size: '8px',
  color: 'grey',
  marginBottom: '2px',
};

const TicketForm: React.FC<any | RouteComponentProps> = ({
  ticket: initialTicketState,
  setIsEditingTicket,
}) => {
  const { ticketStore, groupStore } = useStore();
  const {
    createTicket,
    editTicket,
    createWithPhoto,
    submittingTicket,
    ticketFiles,
  } = ticketStore;
  const {
    groupTitleForUserOptions,
    groupTitles,
    loadGroups,
    loadingGroups,
  } = groupStore;
  const ticket: ITicket = initialTicketState ?? new TicketFormValues();
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    async function loadGroup() {
      if (groupTitles.length <= 0) await loadGroups();
    }
    loadGroup();
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
    // Cleanup?
  }, [loadGroups, groupTitles, files]);

  const handleFinalFormSubmit = async (values: any) => {
    const createdAtdate = new Date().toISOString();

    if (ticket.id.length === 0) {
      let newTicket = {
        ...values,
        date: createdAtdate,
        id: uuid(),
        // photos: files,
      };
      // Create a ticket with attached photo
      if (ticketFiles.length > 0) {
        // createWithPhoto adds the mobx state variable which holds all files.
        createWithPhoto(newTicket);
      } else {
        // Create a new ticket
        createTicket(newTicket);
      }
    } else {
      console.log('Editing ticket: ', values);
      // Editing existing ticket.
      await editTicket(values);
      if (!submittingTicket && setIsEditingTicket) setIsEditingTicket(false);
    }
  };
  if (loadingGroups) return <LoadingComponent content='Preparing data...' />;
  // console.log('Files are: ', files);
  return (
    <Segment fluid='true'>
      <FinalForm
        initialValues={ticket}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <p style={paragraphStyles}>Group</p>
            <Field
              validate={required}
              name='groupId'
              placeholder='Group'
              options={groupTitleForUserOptions}
              value={ticket.groupId}
              component={SelectInput}
            />
            <p style={paragraphStyles}>Title</p>
            <Field
              validate={required}
              name='title'
              placeholder='Title'
              value={ticket.title}
              component={TextInput}
            />
            <p style={paragraphStyles}>Version</p>
            <Field
              validate={required}
              component={TextInput}
              placeholder='Version'
              name='version'
              value={ticket.version}
            />
            <p style={paragraphStyles}>Priority</p>
            <Field
              validate={required}
              component={SelectInput}
              placeholder='Priority'
              name='priority'
              value={ticket.priority}
              options={priorityOptions}
            />
            <p style={paragraphStyles}>Device</p>
            <Field
              validate={required}
              component={TextInput}
              placeholder='Device'
              name='device'
              value={ticket.device}
            />
            <p style={paragraphStyles}>Bug type</p>

            <Field
              validate={required}
              component={TextInput}
              placeholder='Bug type'
              name='bugType'
              value={ticket.bugType}
            />
            <p style={paragraphStyles}>Status</p>

            <Field
              validate={required}
              component={SelectInput}
              placeholder='Status'
              name='status'
              value={ticket.status}
              options={statusOptions}
            />
            <p style={paragraphStyles}>Description</p>

            <Field
              validate={composeValidators(required, minLength(15))}
              component={TextAreaInput}
              rows={2}
              name='description'
              placeholder='Description'
              value={ticket.description}
            />
            {!setIsEditingTicket && (
              <TicketUploadPhoto isPreview={false} isPhoto={true} />
            )}
            {!setIsEditingTicket && (
              <TicketUploadPhoto isPreview={false} isPhoto={false} />
            )}
            <Button
              disabled={ticketStore.submittingTicket || invalid || pristine}
              loading={ticketStore.submittingTicket}
              type='submit'
              positive
            >
              Submit Ticket
            </Button>
          </Form>
        )}
      />
    </Segment>
  );
};

export default observer(TicketForm);
