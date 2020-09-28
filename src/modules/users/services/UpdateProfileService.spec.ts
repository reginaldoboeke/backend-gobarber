import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'reginaldoboeke@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'reginaldo@boeke.com.br',
      name: 'Reginaldo Boeke Ortelã',
    });

    expect(updatedUser.name).toBe('Reginaldo Boeke Ortelã');
    expect(updatedUser.email).toBe('reginaldo@boeke.com.br');
  });

  it('should not be able update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'reginaldoboeke@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'teste@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'reginaldoboeke@gmail.com',
        name: 'Reginaldo Boeke',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'reginaldoboeke@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'reginaldo@boeke.com.br',
      name: 'Reginaldo Boeke Ortelã',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'reginaldoboeke@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'reginaldo@boeke.com.br',
        name: 'Reginaldo Boeke Ortelã',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Reginaldo Boeke',
      email: 'reginaldoboeke@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'reginaldo@boeke.com.br',
        name: 'Reginaldo Boeke Ortelã',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
