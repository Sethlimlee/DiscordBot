var Discord = require("discord.io");
var logger = require("winston");
var axios = require("axios");
var os = require("os");
require("dotenv").config();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.token,
  autorun: true
});
bot.on("ready", function(evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function(user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];
    var name = args[1];

    args = args.splice(1);
    switch (cmd) {
      // !apex
      case "apex":
        axios
          .get(
            "https://public-api.tracker.gg/apex/v1/standard/profile/5/" + name,
            {
              headers: { "TRN-Api-Key": process.env.apiKey }
            }
          )
          .then(response => {
            if (response.data.data.children[0]) {
              var results = [];
              var stats = response.data.data.children[0];
              if (stats.metadata.icon) {
                results.push(stats.metadata.icon);
                results.push("*Only Current Banner Stats Will Be Up To Date*");
                results.push(
                  "*To Get Kills/Damage Per Match, You Must Have Kills, Damage, And Matches Played As Your Banners*"
                );
              }
              if (stats.metadata.legend_name) {
                var name = stats.metadata.legend_name;
                results.push("Best Legend: " + name);
              }
              if (stats.stats) {
                var info = stats.stats.map(statistic => {
                  if (statistic.metadata) {
                    results.push(
                      statistic.metadata.key + ": " + statistic.value
                    );
                  }
                });
                discordMessage = results.join(" " + os.EOL);
                bot.sendMessage({
                  to: channelID,
                  message: discordMessage + os.EOL + os.EOL + "**Current Sopa Bot Commands: !Apex + Origin Username, !Natalie, !Eddie**"
                });
              }
            } else {
              bot.sendMessage({
                to: channelID,
                message: "Something went wrong, F in chat pls"
              });
            }
          })
          .catch(function(error) {
            bot.sendMessage({
              to: channelID,
              message:
                "uhh couldn't find " +
                name +
                " in the database, is that the right name?" +
                os.EOL + os.EOL + "**Current Sopa Bot Commands: !Apex + Origin Username, !Natalie, !Eddie**"
            });
          });
        break;
      // !natalie
      case "natalie":
        axios
          .get("https://api.thecatapi.com/v1/images/search", {
            headers: { "x-api-key": process.env.catKey }
          })
          .then(response => {
            bot.sendMessage({
              to: channelID,
              message:
                response.data[0].url +
                os.EOL + os.EOL + "**Current Sopa Bot Commands: !Apex + Origin Username, !Natalie, !Eddie**"
            });
          });

        break;
      case "eddie":
        bot.sendMessage({
          to: channelID,
          message: "https://www.youtube.com/watch?v=c-ydGUHUDj8" +
          os.EOL + os.EOL + "**Current Sopa Bot Commands: !Apex + Origin Username, !Natalie, !Eddie**"
        });
        break;
      case "help":
        bot.sendMessage({
          to: channelID,
          message:
            "**Current Sopa Bot Commands: !Apex + Origin Username, !Natalie, !Eddie**"
        });
        break;
    }
  }
});
