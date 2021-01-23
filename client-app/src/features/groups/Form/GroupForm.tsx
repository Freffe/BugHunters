import React, { useContext, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IGroup } from '../../../app/models/groups';
import { observer } from 'mobx-react-lite';
import { v4 as uuid } from 'uuid';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import FormCheckbox from '../../../app/common/form/FormCheckbox';
import { RootStoreContext } from '../../../app/stores/rootStore';

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

interface IProps {
  setCreatingGroup: (flag: boolean) => void;
  setSelectedGroup: (flag: any) => void;
}

const GroupForm: React.FC<IProps> = ({
  setCreatingGroup,
  setSelectedGroup,
}) => {
  const initializeForm = () => {
    return {
      id: '',
      groupName: '',
      description: '',
      isPublic: true,
      createdAt: new Date().toISOString(),
      open: 0,
      closed: 0,
      verify: 0,
    };
  };
  const { groupStore } = useContext(RootStoreContext);
  const [group, setGroup] = useState<IGroup>(initializeForm);

  const handleFinalFormSubmit = async (value: any) => {
    if (group.id.length === 0) {
      // value is an observer so dont flip it directly.
      const boolish = !value.isPublic;
      const newGroup: IGroup = {
        ...group,
        id: uuid(),
        groupName: value.groupName,
        description: value.description,
        isPublic: boolish,
      };
      //Create a new group
      await groupStore.createGroup(newGroup);
      console.log('Group created successfully');
      setSelectedGroup(newGroup.id);
      setCreatingGroup(false);
    } else {
      // Editing existing ticket.
      //editGroup(newGroup);
    }
  };

  return (
    <Segment>
      <h3 style={{ justifyContent: 'center' }}>Create a new Group</h3>
      <FinalForm
        initialValues={group}
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              validate={composeValidators(required, minLength(2))}
              name='groupName'
              placeholder='Group Name'
              value={group.groupName}
              component={TextInput}
            />
            <Field
              name='isPublic'
              type='checkbox'
              label='Make Group Private (hidden from search)'
              component={FormCheckbox}
            />
            <Field
              validate={composeValidators(required, minLength(10))}
              rows={2}
              name='description'
              placeholder='Description'
              value={group.description}
              component={TextAreaInput}
            />
            <Button
              disabled={groupStore.submittingGroup || invalid || pristine}
              loading={groupStore.submittingGroup}
              type='submit'
              positive
            >
              Submit Group
            </Button>
            <Button
              onClick={() => {
                setCreatingGroup(false);
                setSelectedGroup(null);
              }}
              type='button'
            >
              Cancel
            </Button>
          </Form>
        )}
      />
    </Segment>
  );
};

export default observer(GroupForm);
