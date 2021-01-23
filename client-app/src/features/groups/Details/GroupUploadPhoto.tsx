import React from 'react';
import { Segment } from 'semantic-ui-react';
import PhotoUploadWidget from '../../../app/common/photoUpload/PhotoUploadWidget';
interface IProps {
  groupId: string;
  uploadPhoto: (...args: any) => Promise<void>;
  loading: boolean;
  setIsAddingPhoto: (flag: boolean) => void;
}
const GroupUploadPhoto: React.FC<IProps> = ({
  groupId,
  uploadPhoto,
  loading,
  setIsAddingPhoto,
}) => {
  return (
    <Segment>
      <p>Upload photo</p>
      <PhotoUploadWidget
        groupId={groupId}
        uploadPhoto={uploadPhoto}
        loading={loading}
        isGroup={true}
        setIsAddingPhoto={setIsAddingPhoto}
      />
    </Segment>
  );
};

export default GroupUploadPhoto;
