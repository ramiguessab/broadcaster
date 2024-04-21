import cors from "cors";
import _ from "lodash";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { randomUUID, UUID } from "crypto";
import { createServer } from "http";
import { Server } from "socket.io";

interface SnapshotContainer {
  scenes: any;
  medias: any;
  sources: any;
  active_scene: string;
  previewed_scene: string;
  allways_on_top: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  maxHttpBufferSize: 5e8,
  cors: { origin: "http://localhost:3000" },
});

/// VARS

const connected: UUID[] = [];

let scenes = {};
let medias = {};
let sources = {};

let active_scene = "";
let previewed_scene = "";
let allways_on_top = "";

/// Signaling

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("new_active_scene", (new_active_scene) => {
    active_scene = new_active_scene;
    socket.broadcast.emit("new_active_scene", active_scene);
    console.log(active_scene);
  });

  socket.on("new_scenes", (new_scenes) => {
    if (!_.isEqual(scenes, new_scenes)) {
      scenes = new_scenes;
      socket.broadcast.emit("new_scenes", scenes);
      console.log(scenes);
    }
  });

  socket.on("new_sources", (new_sources) => {
    sources = new_sources;
    socket.broadcast.emit("new_sources", sources);
    console.log(sources);
  });

  socket.on("new_medias", (new_medias) => {
    medias = new_medias;
    socket.broadcast.emit("new_medias", medias);
    console.log(medias);
  });

  socket.on("element_changed_position", (id, x, y) => {
    Object.values(medias).forEach((media_arr: any) => {
      media_arr.forEach((media: any) => {
        if (media.id === id) {
          media.placement.x = x;
          media.placement.y = y;
          socket.broadcast.emit("new_medias", medias, () => {
            socket.disconnect();
          });
        }
      });
    });
  });

  socket.on("element_changed_scale", (id, new_scale) => {
    Object.values(medias).forEach((media_arr: any) => {
      media_arr.forEach((media: any) => {
        if (media.id === id) {
          media.placement.scale = new_scale;
          socket.broadcast.emit("new_medias", medias, () => {
            socket.disconnect();
          });
        }
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

///

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: false,
  }),
  bodyParser.json(),
  morgan("tiny")
);

///
app.get("/sources", (req, res) => {
  res.status(200).json(sources);
});

app.get("/scenes", (req, res) => {
  res.status(200).json(scenes);
});

app.get("/active_scene", (req, res) => {
  res.status(200).json(active_scene);
});

app.get("/medias", (req, res) => {
  res.status(200).json(medias);
});

///
app.get("/reset", (req, res) => {
  res.status(202).json("server reset with success");
});

app.get("/snapshot", (req, res) => {
  fs.readdir("dump", (err, files) => {
    res.status(200).json({ files });
  });
});

app.post("/snapshot", (req, res) => {
  const file = JSON.stringify({
    active_scene,
    allways_on_top,
    previewed_scene,
    scenes,
    medias,
    sources,
  });
  fs.writeFile(`dump/${new Date().toISOString()}.json`, file, () => {
    fs.writeFile("dump/latest", file, () => {
      res.status(201).json("server state saved");
    });
  });
});

app.put("/snapshot/:snapshot_name", (req, res) => {
  const snapshot_name = req.params;

  fs.readFile(`dump/${snapshot_name}`, (err, data) => {
    if (err) {
      res.status(404).json("file not found");
    } else {
      const string_data = data.toString();
      const parsed_data: SnapshotContainer = JSON.parse(string_data);

      scenes = parsed_data.scenes;
      medias = parsed_data.medias;
      sources = parsed_data.sources;
      active_scene = parsed_data.active_scene;
      previewed_scene = parsed_data.previewed_scene;
      allways_on_top = parsed_data.allways_on_top;

      res.status(202).json(string_data);
    }
  });
});

httpServer.listen(8080, () => {
  console.log("backend server ready on port:8080");
});

// app.get("/source", (req, res) => {
//   get_handler(req, res, endpoints["/source"].value_holder);
// });

// app.post("/source", (req, res) => {
//   post_handler(req, res, "/source" as Routes, endpoints["/source"].event_name);
// });

// app.get(`/subscribe/source`, (req, res) => {
//   subscription_handler(req, res, endpoints["/source"].event_name);
// });

// app.get("/media", (req, res) => {
//   get_handler(req, res, endpoints["/media"].value_holder);
// });

// app.post("/media", (req, res) => {
//   post_handler(req, res, "/media" as Routes, endpoints["/media"].event_name);
// });

// app.get(`/subscribe/media`, (req, res) => {
//   subscription_handler(req, res, endpoints["/media"].event_name);
// });

// app.get("/scene", (req, res) => {
//   get_handler(req, res, endpoints["/scene"].value_holder);
// });

// app.post("/scene", (req, res) => {
//   post_handler(req, res, "/scene" as Routes, endpoints["/scene"].event_name);
// });

// app.get(`/subscribe/scene`, (req, res) => {
//   subscription_handler(req, res, endpoints["/scene"].event_name);
// });

// // HANDLERS

// function get_handler(req: express.Request, res: express.Response, value: any) {
//   return res.status(200).json(value);
// }

// function post_handler(
//   req: express.Request,
//   res: express.Response,
//   name: Routes,
//   event_name: string
// ) {
//   endpoints[name].value_holder = req.body;
//   eventEmitter.emit(event_name, endpoints[name].value_holder);

//   return res
//     .status(201)
//     .json({ response: `${name} sent to server`, is_ok: true });
// }

// function subscription_handler(
//   req: express.Request,
//   res: express.Response,
//   event_name: string
// ) {
//   res.set({
//     "Cache-Control": "no-store",
//     "Content-Type": "text/event-stream",
//   });

//   const handler = (new_data: any) => {
//     new_data = JSON.stringify(new_data);
//     res.write(`data: ${new_data}\n\n`);
//   };

//   eventEmitter.on(event_name, handler);

//   console.log(eventEmitter.listeners(event_name).length);

//   // res.status(200);

//   res.on("close", () => {
//     eventEmitter.off(event_name, handler);
//     res.end();
//   });
// }
