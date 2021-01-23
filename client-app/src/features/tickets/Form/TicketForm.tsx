import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { ITicket, TicketFormValues } from '../../../app/models/tickets';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import TicketUploadPhoto from './TicketUploadPhoto';

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

const TicketForm: React.FC<any | RouteComponentProps> = ({
  ticket: initialTicketState,
}) => {
  const { ticketStore, groupStore } = useContext(RootStoreContext);
  const { createTicket, editTicket, createWithPhoto } = ticketStore;
  const { groupTitles, loadGroups, loadingGroups } = groupStore;
  const [ticket, setTicket] = useState<ITicket>(
    initialTicketState ?? new TicketFormValues()
  );

  const [files, setFiles] = useState<any[]>([]);
  const [isImgInFocus, setIsImgInFocus] = useState(false);

  useEffect(() => {
    async function loadGroup() {
      if (groupTitles.length <= 0) await loadGroups();
    }
    loadGroup();
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
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
      if (files.length > 0) {
        let fileToBlob = async (file: any) =>
          new Blob([new Uint8Array(await file.arrayBuffer())], {
            type: file.type,
          });

        let imgage = await fileToBlob(files[0]);
        //console.log('newTicket: ', imgage);
        createWithPhoto(newTicket, imgage);
      } else {
        // Create a new ticket
        createTicket(newTicket);
      }
    } else {
      console.log('Editing ticket: ', values);
      // Editing existing ticket.
      editTicket(values);
    }
  };
  if (loadingGroups) return <LoadingComponent content='Preparing data...' />;
  console.log('Files are: ', files);
  return (
    <Segment>
      <FinalForm
        initialValues={ticket}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              validate={required}
              name='groupId'
              placeholder='Group'
              options={groupTitles}
              value={ticket.groupId}
              component={SelectInput}
            />

            <Field
              validate={required}
              name='title'
              placeholder='Title'
              value={ticket.title}
              component={TextInput}
            />
            <Field
              validate={required}
              component={TextInput}
              placeholder='Version'
              name='version'
              value={ticket.version}
            />
            <Field
              validate={required}
              component={TextInput}
              placeholder='Priority'
              name='priority'
              value={ticket.priority}
            />
            <Field
              validate={required}
              component={TextInput}
              placeholder='Device'
              name='device'
              value={ticket.device}
            />
            <Field
              validate={required}
              component={TextInput}
              placeholder='Bug type'
              name='bugType'
              value={ticket.bugType}
            />
            <Field
              validate={required}
              component={TextInput}
              placeholder='Status'
              name='status'
              value={ticket.status}
            />
            <Field
              validate={composeValidators(required, minLength(15))}
              component={TextAreaInput}
              rows={2}
              name='description'
              placeholder='Description'
              value={ticket.description}
            />
            <TicketUploadPhoto setFilesForForm={setFiles} />
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
