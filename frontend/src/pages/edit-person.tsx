import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import AvatarUpload from '@/components/people-tab/avatar-upload';
import PersonFormFields from '@/components/people-tab/person-form-fields';
import PersonPreview from '@/components/people-tab/person-preview';
import { peopleService, uploadService, type PersonDetailed, type PersonInput } from '@/services/api';
import { runWithLoaderAndError } from '@/lib/async-handler';
import { useLookupStore } from '@/store/useLookupStore';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const EditPerson = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    avatar: null,
  });

  const [person, setPerson] = useState<PersonDetailed | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPerson();
    } else {
      setError(new Error('Person not found'));
    }
  }, [id, navigate]);

  const fetchPerson = () => {
    setIsLoading(true);
    setError(null);
    peopleService
      .get(id!)
      .then((response) => {
        setPerson(response.data as PersonDetailed);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          description: response.data.description,
          avatar: null,
        });
        setAvatarUrl(response.data?.avatar?.url || null);
        setAvatarFile(null);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAvatarChange = (avatarFile: File | null, avatarUrl: string | null) => {
    setAvatarFile(avatarFile);
    setAvatarUrl(avatarUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const personInput: PersonInput = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatarId: person?.avatar?.id || null,
      description: formData.description,
    };

    runWithLoaderAndError(
      async () => {
        if (avatarFile) {
          const uploadResponse = await uploadService.uploadAvatar(avatarFile, 'person');
          personInput.avatarId = uploadResponse.data.id;
        } else if (!avatarUrl && !avatarFile) {
          personInput.avatarId = null;
        }
        await peopleService.update(id as string, personInput);
        useLookupStore.getState().fetchPeople();
        navigate(`/people/${id}`, { replace: true });
      },
      {
        loaderMessage: 'Updating person...',
        successMessage: 'Person updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Person',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await peopleService.delete(id as string);
            useLookupStore.getState().fetchPeople();
            navigate('/people', { replace: true });
          },
          {
            loaderMessage: 'Deleting person...',
            successMessage: 'Person deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: 'Edit Person',
        description: 'Update person information',
        linkBackward: `/people/${id}`,
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error} linkBackward="/people" onRetry={fetchPerson}>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Person Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AvatarUpload avatar={avatarUrl || ''} name={formData.name} onAvatarChange={handleAvatarChange} />

                <PersonFormFields
                  name={formData.name}
                  email={formData.email}
                  phone={formData.phone}
                  description={formData.description}
                  onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
                  onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
                  onPhoneChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                  onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
                />

                <PersonPreview
                  name={formData.name}
                  email={formData.email}
                  phone={formData.phone}
                  description={formData.description}
                  avatar={avatarUrl || ''}
                />
              </form>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="destructive" onClick={handleDelete} className="w-1/2">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()} className="w-1/2">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default EditPerson;
