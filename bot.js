var Discord = require("discord.io");
var logger = require("winston");
var axios = require("axios");
var os = require("os");
require("dotenv").config();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.token,
  autorun: true,
});
bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(/ (.+)/);
    var cmd = args[0].toLowerCase();
    var name = args[1];

    args = args.splice(1);
    switch (cmd) {
      // #region !Apex
      case "apex":
        axios
          .get(
            "https://public-api.tracker.gg/apex/v1/standard/profile/5/" + name,
            {
              headers: {
                "TRN-Api-Key": process.env.apiKey,
              },
            }
          )
          .then((response) => {
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
                var info = stats.stats.map((statistic) => {
                  if (statistic.metadata) {
                    results.push(
                      statistic.metadata.key + ": " + statistic.value
                    );
                  }
                });
                discordMessage = results.join(" " + os.EOL);
                bot.sendMessage({
                  to: channelID,
                  message:
                    discordMessage +
                    os.EOL +
                    os.EOL +
                    "**Current Sopa Bot Commands: !Cod + Name#platform OR Name#battle.net ID (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490), !Apex + Origin Username, !Natalie, !Eddie**",
                });
              }
            } else {
              bot.sendMessage({
                to: channelID,
                message: "Something went wrong, F in chat pls",
              });
            }
          })
          .catch(function (error) {
            bot.sendMessage({
              to: channelID,
              message:
                "uhh couldn't find " +
                name +
                " in the database, is that the right name?" +
                os.EOL +
                os.EOL +
                "**Current Sopa Bot Commands: !Cod + Name#platform OR Name#battle.net ID (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490), !Apex + Origin Username, !Natalie, !Eddie**",
            });
          });
        break;
      //#endregion !Apex

      // #region !Natalie
      case "natalie":
        axios
          .get("https://api.thecatapi.com/v1/images/search", {
            headers: {
              "x-api-key": process.env.catKey,
            },
          })
          .then((response) => {
            bot.sendMessage({
              to: channelID,
              message:
                response.data[0].url +
                os.EOL +
                os.EOL +
                "**Current Sopa Bot Commands: !Cod + Name#platform OR Name#battle.net ID (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490), !Apex + Origin Username, !Natalie, !Eddie**",
            });
          });
        break;

      //#endregion !Natalie

      // #region Eddie
      case "eddie":
        bot.sendMessage({
          to: channelID,
          message:
            "https://www.youtube.com/watch?v=c-ydGUHUDj8" +
            os.EOL +
            os.EOL +
            "**Current Sopa Bot Commands: !Cod + Name#platform OR Name#battle.net ID (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490), !Apex + Origin Username, !Natalie, !Eddie**",
        });
        break;

      // #endregion Eddie

      // #region !Help
      case "help":
        bot.sendMessage({
          to: channelID,
          message:
            "**Current Sopa Bot Commands: !Cod + Name#platform OR Name#battle.net ID (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490), !Apex + Origin Username, !Natalie, !Eddie, !MPLLC*, !WZKD*",
        });
        break;
      //#endregion !Help

      // #region !Cod
      case "cod":
        if (name) {
          if (name.includes("#")) {
          }
        } else {
          bot.sendMessage({
            to: channelID,
            message:
              "Please enter a valid Name after !cod (EX: !cod Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490)" +
              os.EOL +
              os.EOL +
              "!help",
          });
          break;
        }
        var codName = name.split("#");

        //#region PSN/XBL

        if (
          codName[1].toLowerCase() == "psn" ||
          codName[1].toLowerCase() == "xbl"
        ) {
          axios
            .get(
              `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${codName[1].toLowerCase()}/gamer/${
                codName[0]
              }/profile/type/wz`,
              {
                headers: {
                  cookie:
                    process.env.cookie +
                    " ACT_SSO_COOKIE=ODU1NDcxMzk3NDEwNDAzMjIzOjE1OTE0MTc3NTI4OTQ6MWM4MDgyMjA1N2FiZmM3NzdkODBhZDVkMDZlYzk4OWU; ACT_SSO_COOKIE_EXPIRY=1591417752894; umbrellaId=7518389490605933655; _scid=866d8b0f-7c22-4815-9c02-7410d0709801; _sctr=1|1590127200000; _fbp=fb.1.1590208177768.2123889994; mbox=session#e311e13ecbd341d1a8c53599209ca2c5#1590210755|PC#e311e13ecbd341d1a8c53599209ca2c5.34_0#1653453695; OptanonConsent=isIABGlobal=false&datestamp=Fri+May+22+2020+22%3A41%3A35+GMT-0600+(Mountain+Daylight+Time)&version=5.14.0&landingPath=NotLandingPage&groups=1%3A1%2C0_174752%3A1%2C0_174753%3A1%2C2%3A1%2C0_219555%3A1%2C0_174778%3A1%2C0_174774%3A1%2C0_174754%3A1%2C0_174792%3A1%2C0_174755%3A1%2C3%3A1%2C0_219550%3A1%2C0_174756%3A1%2C4%3A1%2C0_219557%3A1%2C0_174799%3A1%2C0_174757%3A1%2C0_174804%3A1%2C0_174758%3A1%2C0_219548%3A1%2C0_174759%3A1%2C0_174760%3A1%2C0_174761%3A1%2C0_174762%3A1%2C0_174763%3A1%2C0_219558%3A1%2C0_219560%3A1%2C0_174764%3A1%2C0_174765%3A1%2C0_219561%3A1%2C0_219563%3A1%2C0_174766%3A1%2C0_219564%3A1%2C0_174767%3A1%2C0_174768%3A1%2C0_219565%3A1%2C0_174769%3A1%2C0_174770%3A1%2C0_174771%3A1%2C0_174772%3A1%2C0_174773%3A1%2C0_174775%3A1%2C0_174776%3A1%2C0_174777%3A1%2C0_174779%3A1%2C0_174780%3A1%2C0_174781%3A1%2C0_174782%3A1%2C0_174783%3A1%2C0_174784%3A1%2C0_174785%3A1%2C0_174786%3A1%2C0_174787%3A1%2C0_174788%3A1%2C0_174789%3A1%2C0_174790%3A1%2C0_174791%3A1%2C0_174793%3A1%2C0_174794%3A1%2C0_174795%3A1%2C0_174796%3A1%2C0_174797%3A1%2C0_174798%3A1%2C0_174800%3A1%2C0_174801%3A1%2C0_174802%3A1%2C0_174803%3A1%2C0_216175%3A1%2C0_218306%3A1%2C0_218307%3A1%2C0_218308%3A1%2C0_218309%3A1%2C0_219559%3A1%2C0_219547%3A1%2C0_219551%3A1&AwaitingReconsent=false; AMCV_0FB367C2524450B90A490D4C%40AdobeOrg=1075005958%7CMCIDTS%7C18406%7CMCMID%7C73123617618820907210009175893058466195%7CMCAAMLH-1590815216%7C7%7CMCAAMB-1590815216%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1590217616s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.1%7CMCCIDH%7C1928159107; s_nr=1590210417508-New; API_CSRF_TOKEN=b72e1f87-4596-4c69-b92d-4a4f40eae5f2",
                },
              }
            )
            .then((response) => {
              if (response) {
                var stats = response.data.data.weekly.mode.br_all.properties;

                var matchesPlayed = `Matches Played: ${stats.matchesPlayed}`;
                var kills = `Kills: ${stats.kills}`;
                var deaths = `Deaths: ${stats.deaths}`;
                var kD = `K/D: ${stats.kdRatio.toFixed(2)}`;
                var gulagPercent = `Gulag Win Percentage: ${(
                  (stats.gulagKills / (stats.gulagKills + stats.gulagDeaths)) *
                  100
                ).toFixed(2)}%`;
                var averageDamageGivenPerGame = `Average Damage Done Per Game: ${(
                  stats.damageDone / stats.matchesPlayed
                ).toFixed(2)}`;
                var averageDamageReceivedPerGame = `Average Damage Taken Per Game: ${(
                  stats.damageTaken / stats.matchesPlayed
                ).toFixed(2)}`;

                var results = [];
                results.push(codName[0] + "'s Weekly Warzone Stats" + "\n");
                results.push(matchesPlayed + "\n");
                results.push(kills + "\n");
                results.push(deaths + "\n");
                results.push(kD + "\n");
                results.push(gulagPercent + "\n");
                results.push(averageDamageGivenPerGame + "\n");
                results.push(averageDamageReceivedPerGame + "\n");

                discordMessage = results.join(" ");

                bot.sendMessage({
                  to: channelID,
                  message: discordMessage + os.EOL + os.EOL + "!help",
                });
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: "Something went wrong, F in chat pls",
                });
              }
            })
            .catch(function (error) {
              bot.sendMessage({
                to: channelID,
                message:
                  "uhh couldn't find " +
                  name +
                  " in the database, is that the right name? Did you remember to add the # followed by your unique ID? (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490)" +
                  os.EOL +
                  os.EOL +
                  "!help",
              });
            });
        }

        //#endregion PSN/XBL

        //#region Battle.Net
        else {
          axios
            .get(
              `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/battle/gamer/${codName[0]}%23${codName[1]}/profile/type/wz`,
              {
                headers: {
                  cookie:
                    process.env.cookie +
                    " ACT_SSO_COOKIE=ODU1NDcxMzk3NDEwNDAzMjIzOjE1OTE0MTc3NTI4OTQ6MWM4MDgyMjA1N2FiZmM3NzdkODBhZDVkMDZlYzk4OWU; ACT_SSO_COOKIE_EXPIRY=1591417752894; umbrellaId=7518389490605933655; _scid=866d8b0f-7c22-4815-9c02-7410d0709801; _sctr=1|1590127200000; _fbp=fb.1.1590208177768.2123889994; mbox=session#e311e13ecbd341d1a8c53599209ca2c5#1590210755|PC#e311e13ecbd341d1a8c53599209ca2c5.34_0#1653453695; OptanonConsent=isIABGlobal=false&datestamp=Fri+May+22+2020+22%3A41%3A35+GMT-0600+(Mountain+Daylight+Time)&version=5.14.0&landingPath=NotLandingPage&groups=1%3A1%2C0_174752%3A1%2C0_174753%3A1%2C2%3A1%2C0_219555%3A1%2C0_174778%3A1%2C0_174774%3A1%2C0_174754%3A1%2C0_174792%3A1%2C0_174755%3A1%2C3%3A1%2C0_219550%3A1%2C0_174756%3A1%2C4%3A1%2C0_219557%3A1%2C0_174799%3A1%2C0_174757%3A1%2C0_174804%3A1%2C0_174758%3A1%2C0_219548%3A1%2C0_174759%3A1%2C0_174760%3A1%2C0_174761%3A1%2C0_174762%3A1%2C0_174763%3A1%2C0_219558%3A1%2C0_219560%3A1%2C0_174764%3A1%2C0_174765%3A1%2C0_219561%3A1%2C0_219563%3A1%2C0_174766%3A1%2C0_219564%3A1%2C0_174767%3A1%2C0_174768%3A1%2C0_219565%3A1%2C0_174769%3A1%2C0_174770%3A1%2C0_174771%3A1%2C0_174772%3A1%2C0_174773%3A1%2C0_174775%3A1%2C0_174776%3A1%2C0_174777%3A1%2C0_174779%3A1%2C0_174780%3A1%2C0_174781%3A1%2C0_174782%3A1%2C0_174783%3A1%2C0_174784%3A1%2C0_174785%3A1%2C0_174786%3A1%2C0_174787%3A1%2C0_174788%3A1%2C0_174789%3A1%2C0_174790%3A1%2C0_174791%3A1%2C0_174793%3A1%2C0_174794%3A1%2C0_174795%3A1%2C0_174796%3A1%2C0_174797%3A1%2C0_174798%3A1%2C0_174800%3A1%2C0_174801%3A1%2C0_174802%3A1%2C0_174803%3A1%2C0_216175%3A1%2C0_218306%3A1%2C0_218307%3A1%2C0_218308%3A1%2C0_218309%3A1%2C0_219559%3A1%2C0_219547%3A1%2C0_219551%3A1&AwaitingReconsent=false; AMCV_0FB367C2524450B90A490D4C%40AdobeOrg=1075005958%7CMCIDTS%7C18406%7CMCMID%7C73123617618820907210009175893058466195%7CMCAAMLH-1590815216%7C7%7CMCAAMB-1590815216%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1590217616s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.1%7CMCCIDH%7C1928159107; s_nr=1590210417508-New; API_CSRF_TOKEN=b72e1f87-4596-4c69-b92d-4a4f40eae5f2",
                },
              }
            )
            .then((response) => {
              if (response) {
                var stats = response.data.data.weekly.mode.br_all.properties;

                var matchesPlayed = `Matches Played: ${stats.matchesPlayed}`;
                var kills = `Kills: ${stats.kills}`;
                var deaths = `Deaths: ${stats.deaths}`;
                var kD = `K/D: ${stats.kdRatio.toFixed(2)}`;
                var gulagPercent = `Gulag Win Percentage: ${(
                  (stats.gulagKills / (stats.gulagKills + stats.gulagDeaths)) *
                  100
                ).toFixed(2)}%`;
                var averageDamageGivenPerGame = `Average Damage Done Per Game: ${(
                  stats.damageDone / stats.matchesPlayed
                ).toFixed(2)}`;
                var averageDamageReceivedPerGame = `Average Damage Taken Per Game: ${(
                  stats.damageTaken / stats.matchesPlayed
                ).toFixed(2)}`;

                var results = [];
                results.push(codName[0] + "'s Weekly Warzone Stats" + "\n");
                results.push(matchesPlayed + "\n");
                results.push(kills + "\n");
                results.push(deaths + "\n");
                results.push(kD + "\n");
                results.push(gulagPercent + "\n");
                results.push(averageDamageGivenPerGame + "\n");
                results.push(averageDamageReceivedPerGame + "\n");

                discordMessage = results.join(" ");

                bot.sendMessage({
                  to: channelID,
                  message: discordMessage + os.EOL + os.EOL + "!help",
                });
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: "Something went wrong, F in chat pls",
                });
              }
            })
            .catch(function (error) {
              bot.sendMessage({
                to: channelID,
                message:
                  "uhh couldn't find " +
                  name +
                  " in the database, is that the right name? Did you remember to add the # followed by your unique ID? (Calingo93#psn warrenjeffzz#xbl or SopaGrande#1490)" +
                  os.EOL +
                  os.EOL +
                  "!help",
              });
            });
        }
        break;

      // #endregion Battle.Net

      // #endregion !Cod

      // #region MPLLC Team KD

      case "mpllc":
        var array = [
          "battle/gamer/sopagrande%231490/profile/type/wz",
          "battle/gamer/marinegef%231861/profile/type/wz",
          "psn/gamer/calingo93/profile/type/wz",
          "psn/gamer/congo148/profile/type/wz",
        ];

        var totalKills = 0;
        var totalDeaths = 0;
        var count = 0;
        var totalMatches = 0;
        var totalDamage = 0;
        var totalDamageTaken = 0;
        var avgDamage = 0;
        var avgDamageTaken = 0;

        MPLLC(array);

        async function MPLLC(arrayOfMembers) {
          for (i = 0; i < 4; i++) {
            console.log(arrayOfMembers[i]);
            await axios
              .get(
                `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${arrayOfMembers[i]}`,
                {
                  headers: {
                    cookie:
                      // #region code
                      process.env.cookie +
                      " ACT_SSO_COOKIE=ODU1NDcxMzk3NDEwNDAzMjIzOjE1OTE0MTc3NTI4OTQ6MWM4MDgyMjA1N2FiZmM3NzdkODBhZDVkMDZlYzk4OWU; ACT_SSO_COOKIE_EXPIRY=1591417752894; umbrellaId=7518389490605933655; _scid=866d8b0f-7c22-4815-9c02-7410d0709801; _sctr=1|1590127200000; _fbp=fb.1.1590208177768.2123889994; mbox=session#e311e13ecbd341d1a8c53599209ca2c5#1590210755|PC#e311e13ecbd341d1a8c53599209ca2c5.34_0#1653453695; OptanonConsent=isIABGlobal=false&datestamp=Fri+May+22+2020+22%3A41%3A35+GMT-0600+(Mountain+Daylight+Time)&version=5.14.0&landingPath=NotLandingPage&groups=1%3A1%2C0_174752%3A1%2C0_174753%3A1%2C2%3A1%2C0_219555%3A1%2C0_174778%3A1%2C0_174774%3A1%2C0_174754%3A1%2C0_174792%3A1%2C0_174755%3A1%2C3%3A1%2C0_219550%3A1%2C0_174756%3A1%2C4%3A1%2C0_219557%3A1%2C0_174799%3A1%2C0_174757%3A1%2C0_174804%3A1%2C0_174758%3A1%2C0_219548%3A1%2C0_174759%3A1%2C0_174760%3A1%2C0_174761%3A1%2C0_174762%3A1%2C0_174763%3A1%2C0_219558%3A1%2C0_219560%3A1%2C0_174764%3A1%2C0_174765%3A1%2C0_219561%3A1%2C0_219563%3A1%2C0_174766%3A1%2C0_219564%3A1%2C0_174767%3A1%2C0_174768%3A1%2C0_219565%3A1%2C0_174769%3A1%2C0_174770%3A1%2C0_174771%3A1%2C0_174772%3A1%2C0_174773%3A1%2C0_174775%3A1%2C0_174776%3A1%2C0_174777%3A1%2C0_174779%3A1%2C0_174780%3A1%2C0_174781%3A1%2C0_174782%3A1%2C0_174783%3A1%2C0_174784%3A1%2C0_174785%3A1%2C0_174786%3A1%2C0_174787%3A1%2C0_174788%3A1%2C0_174789%3A1%2C0_174790%3A1%2C0_174791%3A1%2C0_174793%3A1%2C0_174794%3A1%2C0_174795%3A1%2C0_174796%3A1%2C0_174797%3A1%2C0_174798%3A1%2C0_174800%3A1%2C0_174801%3A1%2C0_174802%3A1%2C0_174803%3A1%2C0_216175%3A1%2C0_218306%3A1%2C0_218307%3A1%2C0_218308%3A1%2C0_218309%3A1%2C0_219559%3A1%2C0_219547%3A1%2C0_219551%3A1&AwaitingReconsent=false; AMCV_0FB367C2524450B90A490D4C%40AdobeOrg=1075005958%7CMCIDTS%7C18406%7CMCMID%7C73123617618820907210009175893058466195%7CMCAAMLH-1590815216%7C7%7CMCAAMB-1590815216%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1590217616s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.1%7CMCCIDH%7C1928159107; s_nr=1590210417508-New; API_CSRF_TOKEN=b72e1f87-4596-4c69-b92d-4a4f40eae5f2",
                    // #endregion code
                  },
                }
              )
              .then((response) => {
                var stats = response.data.data.weekly.mode.br_all.properties;
                console.log(arrayOfMembers[i] + " kills: " + stats.kills);
                console.log(arrayOfMembers[i] + " deaths: " + stats.deaths);
                console.log(`Matches Played: ${stats.matchesPlayed}`);
                console.log(`Damage: ${stats.damageDone}`);
                console.log(`Damage Taken: ${stats.damageTaken}`);

                totalMatches += stats.matchesPlayed;
                totalKills += stats.kills;
                totalDeaths += stats.deaths;
                totalDamage += stats.damageDone;
                totalDamageTaken += stats.damageTaken;

                console.log("Total Kills: " + totalKills);
                console.log("Total Deaths: " + totalDeaths);
                console.log("Total Matches: " + totalMatches);
                console.log("Total Damage: " + totalDamage);
                console.log("Total Damage Taken: " + totalDamageTaken);

                count++;
                console.log("members gone through " + count);

                if (count === 4) {
                  var teamKD = (totalKills / totalDeaths).toFixed(2);
                  avgDamage = (totalDamage / totalMatches).toFixed(2);
                  avgDamageTaken = (totalDamageTaken / totalMatches).toFixed(2);

                  bot.sendMessage({
                    to: channelID,
                    message:
                      "------**MPLLC WEEKLY STATS**------" +
                      os.EOL +
                      "(Sopa, MarineGEF, Calingo, Congo)" +
                      os.EOL +
                      os.EOL +
                      "Total Kills: " +
                      totalKills +
                      os.EOL +
                      "Total Deaths: " +
                      totalDeaths +
                      os.EOL +
                      "KD: " +
                      teamKD +
                      os.EOL +
                      os.EOL +
                      "Average Damage Per Match: " +
                      avgDamage +
                      os.EOL +
                      os.EOL +
                      "Average Damage Taken Per Match: " +
                      avgDamageTaken +
                      os.EOL +
                      os.EOL +
                      "!help",
                  });
                }
              });
          }
        }
        break;

      // #endregion MPLLC Team KD

      // #region WZKD

      case "wzkd":
        var array = [
          "battle/gamer/sopagrande%231490/profile/type/wz",
          "battle/gamer/marinegef%231861/profile/type/wz",
          "psn/gamer/calingo93/profile/type/wz",
          "psn/gamer/congo148/profile/type/wz",
          "battle/gamer/Whiteout%2311557/profile/type/wz",
          "psn/gamer/Datryhard-PaNdA/profile/type/wz",
          "battle/gamer/DarkPaNdA05%231794/profile/type/wz",
          "battle/gamer/J4ngoF3tt%231506/profile/type/wz",
          "xbl/gamer/warrenjeffzz/profile/type/wz",
          "psn/gamer/G-Son93/profile/type/wz",
          "battle/gamer/THEBROWNBUDA%231230/profile/type/wz",
        ];

        var nameArray = [
          "SopaGrande",
          "MarineGEF",
          "Calingo93",
          "Congo148",
          "Whiteout",
          "Datryhard-PaNdA",
          "DarkPaNdA05",
          "J4ngoF3tt",
          "warrenjeffzz",
          "G-Son93",
          "THEBROWNBUDA",
        ];
        var count = 0;
        var displayArray = ["------**Weekly Warzone KDs**------"];

        WZKD(array);

        async function WZKD(arrayOfMembers) {
          for (i = 0; i < arrayOfMembers.length; i++) {
            await axios
              .get(
                `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${arrayOfMembers[i]}`,
                {
                  headers: {
                    cookie:
                      // #region code
                      process.env.cookie +
                      " ACT_SSO_COOKIE=ODU1NDcxMzk3NDEwNDAzMjIzOjE1OTE0MTc3NTI4OTQ6MWM4MDgyMjA1N2FiZmM3NzdkODBhZDVkMDZlYzk4OWU; ACT_SSO_COOKIE_EXPIRY=1591417752894; umbrellaId=7518389490605933655; _scid=866d8b0f-7c22-4815-9c02-7410d0709801; _sctr=1|1590127200000; _fbp=fb.1.1590208177768.2123889994; mbox=session#e311e13ecbd341d1a8c53599209ca2c5#1590210755|PC#e311e13ecbd341d1a8c53599209ca2c5.34_0#1653453695; OptanonConsent=isIABGlobal=false&datestamp=Fri+May+22+2020+22%3A41%3A35+GMT-0600+(Mountain+Daylight+Time)&version=5.14.0&landingPath=NotLandingPage&groups=1%3A1%2C0_174752%3A1%2C0_174753%3A1%2C2%3A1%2C0_219555%3A1%2C0_174778%3A1%2C0_174774%3A1%2C0_174754%3A1%2C0_174792%3A1%2C0_174755%3A1%2C3%3A1%2C0_219550%3A1%2C0_174756%3A1%2C4%3A1%2C0_219557%3A1%2C0_174799%3A1%2C0_174757%3A1%2C0_174804%3A1%2C0_174758%3A1%2C0_219548%3A1%2C0_174759%3A1%2C0_174760%3A1%2C0_174761%3A1%2C0_174762%3A1%2C0_174763%3A1%2C0_219558%3A1%2C0_219560%3A1%2C0_174764%3A1%2C0_174765%3A1%2C0_219561%3A1%2C0_219563%3A1%2C0_174766%3A1%2C0_219564%3A1%2C0_174767%3A1%2C0_174768%3A1%2C0_219565%3A1%2C0_174769%3A1%2C0_174770%3A1%2C0_174771%3A1%2C0_174772%3A1%2C0_174773%3A1%2C0_174775%3A1%2C0_174776%3A1%2C0_174777%3A1%2C0_174779%3A1%2C0_174780%3A1%2C0_174781%3A1%2C0_174782%3A1%2C0_174783%3A1%2C0_174784%3A1%2C0_174785%3A1%2C0_174786%3A1%2C0_174787%3A1%2C0_174788%3A1%2C0_174789%3A1%2C0_174790%3A1%2C0_174791%3A1%2C0_174793%3A1%2C0_174794%3A1%2C0_174795%3A1%2C0_174796%3A1%2C0_174797%3A1%2C0_174798%3A1%2C0_174800%3A1%2C0_174801%3A1%2C0_174802%3A1%2C0_174803%3A1%2C0_216175%3A1%2C0_218306%3A1%2C0_218307%3A1%2C0_218308%3A1%2C0_218309%3A1%2C0_219559%3A1%2C0_219547%3A1%2C0_219551%3A1&AwaitingReconsent=false; AMCV_0FB367C2524450B90A490D4C%40AdobeOrg=1075005958%7CMCIDTS%7C18406%7CMCMID%7C73123617618820907210009175893058466195%7CMCAAMLH-1590815216%7C7%7CMCAAMB-1590815216%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1590217616s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.1%7CMCCIDH%7C1928159107; s_nr=1590210417508-New; API_CSRF_TOKEN=b72e1f87-4596-4c69-b92d-4a4f40eae5f2",
                    // #endregion code
                  },
                }
              )
              .then((response) => {
                try {
                  var stats = response.data.data.weekly.mode.br_all.properties;

                  var kd = (stats.kills / stats.deaths).toFixed(2);
                  console.log(nameArray[i]);

                  displayArray.push(os.EOL + nameArray[i] + " " + kd);

                  count++;

                  if (count === arrayOfMembers.length) {
                    bot.sendMessage({
                      to: channelID,
                      message: displayArray.join(os.EOL),
                    });
                  }
                } catch {
                  count++;
                  if (count === arrayOfMembers.length) {
                    bot.sendMessage({
                      to: channelID,
                      message: displayArray.join(os.EOL),
                    });
                  }
                }
              });
          }
        }

      // #endregion WZKD
    }
  }
});
