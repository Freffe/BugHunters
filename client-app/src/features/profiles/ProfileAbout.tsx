import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import TextInput from '../../app/common/form/TextInput';
import {
  IProfile,
  IProfileEdits,
  ProfileFormValues,
} from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

const required = (value: any) => (value ? undefined : 'Required');

interface IProps {
  editProfile: (profile: IProfileEdits) => Promise<void>;
  setEditMode: (flag: boolean) => void;
  profile: IProfile;
}

const ProfileAbout: React.FC<IProps> = ({
  editProfile,
  profile,
  setEditMode,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { loadingProfileUpdate } = rootStore.profileStore;
  const { user } = rootStore.userStore;
  const [profileData, setProfileData] = useState(new ProfileFormValues());

  const handleFinalFormSubmit = async (values: any) => {
    try {
      await editProfile(values);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Load in initial profile values to fill the form

  useEffect(() => {
    if (user) {
      setProfileData(new ProfileFormValues(profile!));
    }
  }, [user, profile, setProfileData]);

  return (
    <FinalForm
      initialValues={profileData}
      onSubmit={handleFinalFormSubmit}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} loading={loadingProfileUpdate}>
          <Field
            validate={required}
            placeholder='Display Name'
            value={profileData.displayName}
            name='displayName'
            component={TextInput}
          />
          <Field
            placeholder='Bio'
            value={profileData.bio}
            name='bio'
            rows={3}
            component={TextAreaInput}
          />
          <Button
            disabled={loadingProfileUpdate || invalid || pristine}
            loading={loadingProfileUpdate}
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

export default observer(ProfileAbout);
