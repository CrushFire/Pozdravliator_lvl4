import { AddUpdateBirthday } from '../components/AddUpdateBirthday';

export const Create = () => {

  const handleSuccess = () => {}

  return (
    <div>
      <AddUpdateBirthday onSuccess={handleSuccess} />
    </div>
  );
};