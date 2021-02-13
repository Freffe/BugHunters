import React, { useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { GroupDescriptionValues } from '../../../app/models/groups';

const required = (value: any) => (value ? undefined : 'Required');

const GroupDescriptionEdit: React.FC<{
  description: string;
  handleFinalFormSubmit: any;
  isUploadingGroupEdit: boolean;
}> = ({ description, handleFinalFormSubmit, isUploadingGroupEdit }) => {
  const [profileData, setProfileData] = useState(new GroupDescriptionValues());

  useEffect(() => {
    if (description !== profileData.description) {
      setProfileData(new GroupDescriptionValues(description));
    }
  }, [description, profileData]);
  return (
    <FinalForm
      initialValues={profileData}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            validate={required}
            placeholder='Description'
            value={profileData.description}
            name='description'
            component={TextAreaInput}
          />
          <Button
            disabled={invalid || pristine}
            loading={isUploadingGroupEdit}
            floated='right'
            positive
            type='submit'
            content='submit'
          />
        </Form>
      )}
    />
  );
};

export default GroupDescriptionEdit;
