const Raw_File = require("../Model/raw_file");
const Incident_File = require("../Model/incident_file");

const tag = async (req, res) => {
  let US = req.body.user_status;
  const incidentFilesExist = await Incident_File.findOne({
    s3_path: req.body.s3_path,
  });

  if (incidentFilesExist) {
    let updateParams = {};
    switch (US) {
      case 1:
        updateParams = {
          "tags_for_review.internal_review.reviewer.flag": req.body.flag,
          "tags_for_review.internal_review.reviewer.comments":
            req.body.comments,
        };
        break;
      case 2:
        updateParams = {
          "tags_for_review.internal_review.manager_review.flag": req.body.flag,
          "tags_for_review.internal_review.manager_review.comments":
            req.body.comments,
        };

        break;
      case 3:
        updateParams = {
          "tags_for_review.client_review.flag": req.body.flag,
          "tags_for_review.client_review.comments": req.body.comments,
        };
        break;
    }
    try {
      Incident_File.updateOne(
        { _id: incidentFilesExist._id },
        updateParams,
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    let rawFile = await Raw_File.findOne({ s3_path: req.body.s3_path });

    const incident = new Incident_File({
      file_name: rawFile.file_name,
      s3_path: rawFile.s3_path,
      raw_file_id: rawFile._id,
      size: req.body.size ?? undefined,
      duration: req.body.duration ?? undefined,
      classifier_id: req.body.classifier_id ?? undefined,
      tags_for_review: {
        internal_review: {
          reviewer: {
            ...(US == 1
              ? {
                  date_time: undefined,
                  flag: req.body.flag,
                  comments: req.body.comments,
                }
              : { date_time: null, flag: undefined, comments: undefined }),
          },
          manager_review: {
            ...(US == 2
              ? {
                  date_time: undefined,
                  flag: req.body.flag,
                  comments: req.body.comments,
                }
              : { date_time: null, flag: undefined, comments: undefined }),
          },
        },
        client_review: {
          ...(US == 3
            ? {
                date_time: undefined,
                flag: req.body.flag,
                comments: req.body.comments,
              }
            : { date_time: null, flag: undefined, comments: undefined }),
        },
      },
    });
    try {
      const savedIncident = await incident.save();
      res.send("Incident Saved");
    } catch (err) {
      res.status(400).send(err);
    }
  }
};

module.exports = {
  tag,
};
