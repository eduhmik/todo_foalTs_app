// 3p
import { createConnection } from 'typeorm';

// App
import { Todo, User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    owner: { type: 'string', format: 'email' },
    text: {type: 'string'}
  },
  required: [ 'owner', 'text' ],
  type: 'object',
};

export async function main(args) {
  // create a new connection to the database
  const connection = await createConnection();

  const user = await connection.getRepository(User).findOne({ email: args.owner });

  if (!user) {
    console.log('No user was found with the email ' + args.owner);
    return;
  }


  // create a new task with the text given in the command line
  const todo = new Todo();
  todo.text = args.text;
  todo.owner = user;

  // save the task in the db and display it in the console
  console.log(
    await connection.manager.save(todo)
  );

  // close the db connection
  await connection.close();
}
