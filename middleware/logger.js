// const winston = require("winston");
// const fs = require("fs");
// const logDir = 'logs';
// const config = require("../app_config/config").logSettings;

// var globalcount = 0;


// var mkDirSync = function(path){
//     try {
//         if (!fs.existsSync(path)) {
//             // Create the directory if it does not exist
//             fs.mkDirSync(path);
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }

// if(mkDirSync){
//     mkDirSync(logDir);

// }


// exports.newLogger = function (folder, file) {

//     // PATH
//     var path = logDir + (folder ? "\\" + folder : "");

//     // CREATE LOG FOLDER DIRECTORY
//     mkDirSync(path);

//     // LOGGER OPTIONS
//     var winstonOptions = {
//         transports: [
//             new winston.transports.Console({ level: config.consoleLogLevel || "info", colorize: true }), //, json: true
//            //, new winston.transports.File({ filename: path + "\\" + file, level: config.logLevel, prettyPrint: true, json: false, timestamp: false })
//         ],
//         exceptionHandlers: [
//             new winston.transports.File({ filename: logDir + '\\exceptions.log' })
//         ],
//         exitOnError: false
//     };

//     return new winston.Logger(winstonOptions);
// }

// exports.filelogger = function (logtype, data, file) {
   
//     var path = logDir;

//     mkDirSync(path);
    
//     if (!logtype)
//     {
//         logtype = 'error';
//     }
//     fs.exists(path + "\\" + file, function (exists) {
//         if (config.logLevel == logtype)
//             fs.appendFileSync(path + "\\" + file, data+"\r\n");
//     });
//     return false;
// }


// exports.writetofile = function (message, filename, foldername,error) {
//     try
//     {
//         var data = message.join(' -EOL- \r\n') + 'EOL  EOL';
//         if (!foldername) {
//             foldername = "logs";
//         }
//         var path = foldername;
//         try {
//             mkDirSync(path);
//         } catch (ex) {
//             console.log("exception while making dir : " + ex);
//         }

//         globalcount = globalcount + 1;
//         //console.log("this.globalcount" +globalcount);
//         path = foldername + "\\" + filename + "_" + globalcount + ".txt";
//         // if (error){
//             fs.writeFile(path, data, function (err) {
//                 if (err) { console.log('ERROR while writting file : ' + err) };

//             });
//         // }
//     }catch(ex)
//     {
//         console.log("exception while writting file :" + ex);
//     }
// }



