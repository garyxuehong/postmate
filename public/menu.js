const isMac = process.platform === 'darwin'

module.exports = { getTemplate };

function getTemplate({ onFireRequest }) {
  return [
    ...(isMac
      ? [
          {
            label: "Postmate",
            submenu: [
              { role: "about" },
              {
                type: "separator"
              },
              { role: "services" },
              {
                type: "separator"
              },
              { role: "hide" },
              {
                role: "hideothers"
              },
              { role: "unhide" },
              {
                type: "separator"
              },
              { role: "quit" }
            ]
          }
        ]
      : []),
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }]
    },
    {
      label: "Tools",
      submenu: [
        {
          label: "Fire Request",
          accelerator: "CmdOrCtrl+Enter",
          click: async () => {
            onFireRequest();
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        {
          role: "togglefullscreen"
        }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              {
                type: "separator"
              },
              { role: "front" },
              {
                type: "separator"
              },
              { role: "window" }
            ]
          : [{ role: "close" }])
      ]
    },
    {
      role: "help",
      submenu: []
    }
  ];
}
