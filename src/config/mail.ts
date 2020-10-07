interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'email-configurado-nos-emails-addres-na-amazon-ses@email.com',
      name: 'Reginaldo Boeke',
    },
  },
} as IMailConfig;
