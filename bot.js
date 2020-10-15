const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var AdminHandler = (function () {
  function setRole(user, message, array) {

    let rolename = array.slice(2).join(" ");
    rolename = rolename.toLowerCase();
    rolename = rolename.trim();

    const allowedRole = message.guild.roles.find(role => role.name.toLowerCase() === rolename);
    if (allowedRole != null) {
      var nuser = message.guild.members.get(user.id);

      if (!nuser.roles.has(allowedRole.id)) {
        nuser.addRole(message.guild.roles.find(role => role.name.toLowerCase() === rolename))
        message.channel.send(user + ", you now have the role " + rolename);
      } else {
        message.reply(user + " already has the role " + rolename);
      }
    } else {
      message.reply("Invalid role name! check how you spelled the role.");
    }

  }

  function removeRole(user, message, rolename) {
    rolename = rolename.toLowerCase();
    const roleToRemove = message.guild.roles.find(role => role.name.toLowerCase() === rolename);
    if (roleToRemove != null) {
      var userinfo = message.guild.members.get(user.id);

      if (userinfo.roles.has(roleToRemove.id)) {

        userinfo.removeRole(message.guild.roles.find(role => role.name.toLowerCase() === rolename))
        message.channel.send("The role " + rolename + " has been removed from " + user + "!");
      } else {
        message.reply(user + " don't have the role " + rolename);
      }
    } else {
      message.reply("Invalid role name. Check how you spelled the role.");
    }

  }

  function deleteRole(message, rolename) {
    const roleToDelete = message.guild.roles.find(role => role.name.toLowerCase() === rolename);

    if (roleToDelete != null) {

      message.guild.roles.find(role => role.name === roleToDelete.name).delete();
      message.channel.send("The role " + rolename + " has been removed from!");

    } else {
      message.reply("Invalid role name. Check how you spelled the role.");
    }

  }

  function setRoleColor(testhex, hexcode, rolename, message, array) {
    var roleToEdit;

    if (testhex.length != 7 || testhex[0] != "#") {
      roleToEdit = message.guild.roles.find(role => role.name.toLowerCase() === rolename.toLowerCase());
      hexcode = roleToEdit.hexColor;
      message.channel.send("You didn't add a hexcolor, so the role has been given its old color.");
    } else {

      rolename = array.slice(1, -1).join(" ");
      roleToEdit = message.guild.roles.find(role => role.name.toLowerCase() === rolename.toLowerCase());
    }

    if (hexcode != roleToEdit.hexColor) {
      message.channel.send("This is the role you're looking at: " + roleToEdit + "\n Its hexcolor was: " + roleToEdit.hexColor + " and has now been changed to " + hexcode);
    }

    roleToEdit.setColor(hexcode);
  }

  function removeEmptyRoles(message) {
    //variables that tells you the names of the roles and the number of roles you've removed.
    var rolesRemoved = "";
    var removedcount = 0;

    //goes through every role and checks its size.
    message.guild.roles.forEach(role => {
      //types out the name, id and size into the command promt, it's not really needed but it's better to test it again to make sure that no role with members gets deleted.
      console.log(role.name, role.id, role.members.size);

      //if there's no one in the role
      if (role.members.size === 0) {
        //sends a message to tell you that the role is being removed, this message is unneccessary, it'll spam the server if many roles are to be deleted.
        message.reply("Removing role " + role.name + "..." + "There was " + role.members.size + " members part of this role. ");
        //puts the removed role name into the variable rolesremoved
        rolesRemoved = rolesRemoved + role.name + ", "
        //removes the role if the size is 0.
        message.guild.roles.find(roleToRemove => roleToRemove.name === role.name).delete();          // adds 1 to the count of removed roles.
        removedcount++;
      }
    });
    //message to give you the statistcs of the amount of roles you've deleted (and their names)
    //You won't be able to get the roles back after deleting them, as the variables becomes empty when the function is used again.
    message.reply("\nRoles removed:" + removedcount + "\n roles removed (names): " + rolesRemoved);
  }
  return {
    setRole,
    removeRole,
    deleteRole,
    setRoleColor,
    removeEmptyRoles,
    getDatabaseInfo
  }
})();

var UserHandler = (function () {

  function userCommands(message) {

    const exampleEmbed = {
      color: 0x007fff,
      title: ' > Commands',
      url: 'https://discord.js.org',
      author: {
        name: 'SweDark',
        icon_url: 'https://i.imgur.com/rwEF8Tt.png',
        url: 'https://discord.js.org',
      },
      description: '> __Commands available for users__',
      thumbnail: {
        url: 'https://i.imgur.com/rwEF8Tt.png',
      },
      fields: [
        {
          name: '`.listroles`',
          value: 'Lists all available roles on the server',
        },
        {
          name: '`.getroles <rolename>`',
          value: 'Adds an already existing role',
        },
        {
          name: '`.createrole <rolename> <#hexcolor>`',
          value: 'Creates a role with said rolename and hexcolor',
        },
        {
          name: '`.removerole <rolename>`',
          value: 'removes said rolename from you',
        },
        {
          name: '`example`',
          value: 'test1\n test2\n<:ElenSip:673011714488533002> '
        },
        {
          name: '`example2`',
          value: '`1.` test \n`2.` test2 (<@&708762595854778491>)\n`3.` test3 (<@&657193027143467038>)',
          inline: false,
        },
        {
          name: '`example3`',
          value: '```swift\n1. test \n2. test2 (<@&708762595854778491>)\n3. test3 (<@&657193027143467038>)```',
          inline: false,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: '> The command list <',
        icon_url: 'https://i.imgur.com/rwEF8Tt.png',
      },
    };
   /* const commandEmbed = new Discord.MessageEmbed()
	.setColor('#007fff')
	.setTitle('Commands')
	.setAuthor('SweDark', 'https://i.imgur.com/rwEF8Tt.png')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
    { name: '.listroles', value: 'Lists all available roles on the server', inline: true },
    { name: '.getrole <rolename>', value: 'Adds an already existing role', inline: true },
    { name: '.createrole <rolename> <#hexcolor>', value: 'Creates a role with said rolename and hexcolor.', inline: true },
    { name: '.removerole <rolename>', value: 'removes a said rolename from you', inline: true }
  )
  .setFooter('https://i.imgur.com/rwEF8Tt.png');
  
    let commandmessage = "```css\n[List of commands]";
    commandmessage += "\n\n[user commands]";
    commandmessage += "\n.listroles - 'lists all available roles on the server'";
    commandmessage += "\n.getrole <rolename> - 'adds an already existing role to you'";
    commandmessage += "\n.createrole <rolename> <#hexcolor> - 'creates a role.'";
    commandmessage += "\n.removerole <rolename> - 'removes a role that you have'";
    commandmessage += "\n\n[admin commands]";
    commandmessage += "\n.setrole <user> <rolename> - 'adds a user to a role'";
    commandmessage += "\n.takerole <user> <rolename> - 'Takes away a role from a user'";
    commandmessage += "\n.deleterole <rolename> - 'deletes the role from the server'";
    commandmessage += "\n.setcolor <rolename> <#hexcolor> - 'changes given rolename's color";
    commandmessage += "\n.removeemptyroles - 'removes all empty roles'```";*/
    message.channel.send({ embed: exampleEmbed});

    /*if(message.user.hasPermission('ADMINISTRATOR')){
      const AdminCommandEmbed = new Discord.MessageEmbed()
      .setColor('#007fff')
	    .setTitle('Admin commands')
	    .setAuthor('SweDark', 'https://i.imgur.com/rwEF8Tt.png')
	    .setDescription('')
	    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	    .addFields(
        { name: '.setrole <user> <rolename>', value: 'Adds said role to said user', inline: true },
        { name: '.takerole <user> <rolename>', value: 'Takes said role from said user', inline: true },
        { name: '.deleterole <rolename>', value: 'Deletes said role from the server', inline: true },
        { name: '.setcolor <rolename> <#hexcolor>', value: 'Changes said role'+"'"+'s color', inline: true },
        { name: '.removeemptyroles', value: 'removes all empty roles from the server', inline: true },
      )
      .setFooter('https://i.imgur.com/rwEF8Tt.png');
    }
    message.channel.send(AdminCommandEmbed);*/
  }

  function addUserRole(array, message) {
    let rolename = array.slice(1).join(" ");
    rolename = rolename.toLowerCase();

    if (!message.member.roles.find(role => role.name.toLowerCase() == rolename)) {

      if (rolename != " " && message.guild.roles.find(role => role.name.toLowerCase() === rolename) && !role.hasPermission('ADMINISTRATOR') && !role.hasPermission('CHANGE_NICKNAME')) {
        message.member.addRole(message.guild.roles.find(role => role.name.toLowerCase() === rolename));
        message.reply("You now have the " + rolename + " role cause I gave it to you!");
      } else {
        message.reply("You didn't follow the format of adding a role or the role doesn't exist/is unavailable!");
      }

    } else {
      message.reply("You already got the role " + rolename + "!");
    }
  }

  function listRoles(message) {
    let allroles = "```css\n [Roles]\n";
    let roleCount = 0;

    message.guild.roles.forEach(role => {
      if (role.name !== "@everyone" && !role.hasPermission('ADMINISTRATOR') && !role.hasPermission('CHANGE_NICKNAME')) {
        roleCount++;
        allroles = allroles + "#" + roleCount + ": " + role.name + "\n"
      }
    });

    allroles = allroles + "```"
    message.channel.send(allroles);
  }

  function removeUserRole(rolename, message) {
    //checks if the role you're attempting to remove is an admin role
    if(!rolename.hasPermission('ADMINISTRATOR')){
       message.member.removeRole(message.guild.roles.find(role => role.name.toLowerCase() === rolename.toLowerCase()));

      //sends a reply
      message.reply("You have removed " + rolename + " from your user!");
    }
    //if (message.member.roles.find(role => role.name.toLowerCase() !== "lair chief (admin)")) {
      //removes the role from the user
    //} 
    else {
      message.reply("\n You can't remove an admin role!");
    }
  }

  function createUserRole(hexcode, rolename, message) {

    message.guild.createRole({ // Call createRole on guild object
      name: rolename,
      color: hexcode, // ColorResolvable; either "RANDOM" hex as string or color name
      permissions: [ // Array of permissions the role should have 
        "SEND_MESSAGES",
      ],
      hoist: false, // Whether the role should be displayed on the right side (online list)
      position: 2 // Role position
    });
    message.reply("\n the role '" + rolename + "' has been created!");
  }

  return {
    userCommands,
    addUserRole,
    listRoles,
    removeUserRole,
    createUserRole
  }
})();

client.on('message', message => {
  let array = message.content.split(" ");
  let rolename;

  switch (array[0].toLowerCase()) {

    case '.commands':
/*
      const exampleEmbed = {
        color: 0x007fff,
        title: '> Commands',
        url: 'https://discord.js.org',
        author: {
          name: 'SweDark',
          icon_url: 'https://i.imgur.com/rwEF8Tt.png',
          url: 'https://discord.js.org',
        },
        description: 'Commands available for users',
        thumbnail: {
          url: 'https://i.imgur.com/rwEF8Tt.png',
        },
        fields: [
          {
            name: '> `.listroles`',
            value: 'Lists all available roles on the server',
          },
          {
            name: '`.getroles <rolename>`',
            value: 'Adds an already existing role',
          },
          {
            name: '`.createrole <rolename> <#hexcolor>`',
            value: 'Creates a role with said rolename and hexcolor',
          },
          {
            name: '`.removerole <rolename>`',
            value: 'removes said rolename from you',
          },
          {
            name: '`example`',
            value: 'test1\n test2\n<:ElenSip:673011714488533002> '
          },
          {
            name: '\u200b',
            value: 'test',
            inline: false,
          }

        ],
        timestamp: new Date(),
        footer: {
          text: '> The command list <',
          icon_url: 'https://i.imgur.com/rwEF8Tt.png',
        },
      };
    */
     // message.channel.send({ embed: exampleEmbed });
     // message.reply.("this is test");

      UserHandler.userCommands(message);
      break;

    case '.getrole':
      UserHandler.addUserRole(array, message);
      break;

    case '.listroles':
      UserHandler.listRoles(message);
      break;

    case '.removerole':
      rolename = array.slice(1).join(" ");
      if (rolename != " " && message.member.roles.find(role => role.name.toLowerCase() === rolename.toLowerCase())) {
        UserHandler.removeUserRole(rolename, message);
      } else {
        message.reply("You don't have a role with the name '" + rolename + "'!");
      }
      break;

    case '.createrole':
      let hexcode = array[array.length - 1];
      let testhex = hexcode.split("");

      if (testhex.length != 7 || testhex[0] != "#") {
        rolename = array.slice(1).join(" ");
        hexcode = "#ff0000";
        message.channel.send("You didn't add a hexcolor, so the role has gotten the default color #ff0000");
      } else {
        rolename = array.slice(1, -1).join(" ");
      }

      rolename = rolename.trim();
      if (rolename.length > 3 && message.member.roles.find(role => role.name.toLowerCase() !== rolename.toLowerCase())) {
        UserHandler.createUserRole(hexcode, rolename, message);
      } else {
        message.reply("\n The role already exists or you've entered a blank role name! \n check the .listroles if the role you're trying to make already exists. \n Also, make sure follow this example: .createrole test #204050");
      }
      break;

    case '.setrole':
      if (message.member.hasPermission("ADMINISTRATOR")) {
        let user = message.mentions.users.first();
        if (user != null) {
          AdminHandler.setRole(user, message, array);
        } else {
          message.reply("No user mentioned");
        }
      } else {
        message.reply("You don't have access to this function!");
      }
      break;

    case '.takerole':
      if (message.member.hasPermission("ADMINISTRATOR")) {
        rolename = array.slice(2).join(" ");
        rolename = rolename.trim();
        let user = message.mentions.users.first();
        if (user != null) {
          AdminHandler.removeRole(user, message, rolename);
        } else {
          message.reply("No user mentioned");
        }
      } else {
        message.reply("You don't have access to this function!");
      }
      break;

    case '.deleterole':
      if (message.member.hasPermission("ADMINISTRATOR")) {
        rolename = array.slice(1).join(" ");
        rolename = rolename.trim();
        AdminHandler.deleteRole(message, rolename);
      } else {
        message.reply("You don't have access to this function!");
      };
      break;

    case '.setcolor':
      if (message.member.hasPermission("ADMINISTRATOR")) {
        rolename = array.slice(1, -1).join(" ");
        let hexcode = array[array.length - 1];
        let testhex = hexcode.split("");

        if (message.guild.roles.find(role => role.name.toLowerCase() === rolename.toLowerCase()) && testhex[0] == "#") {
          AdminHandler.setRoleColor(testhex, hexcode, rolename, message, array);
        } else {
          message.channel.send("No role found, check the spelling and make sure you've added a new color!");
        }
      } else {
        message.reply("You don't have access to this function!");
      }
      break;
      
    case '.removeemptyroles':
      //checks if the role of the user is an admin, if you're an admin then you can remove the roles with 0 members.
      if (message.member.hasPermission("ADMINISTRATOR")) {
        AdminHandler.removeEmptyRoles(message);
      } else {
        //if you're not an admin you see this.
        message.reply("You don't have access to this function!");
      }
      break;

    //case '.getrole':
    //  UserHandler.addUserRole(array, message);
    //  break;
  }


});

//When a new member joins the server
client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  //searches for the channel that is called lobby and then sends a message.
  guild.channels.find(channel => channel.name === "lobby").send("Welcome " + member + "!\n");
  //add the new member to the role called "Nemesis"
  member.addRole(guild.roles.find(role => role.name === "Member"));

});


client.login(auth.token);
//everytime you change the bot, use node bot.js in command in the folder of the bot.