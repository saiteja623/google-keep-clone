import React, { Component } from "react";
import FlipMove from "react-flip-move";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  IconButton,
} from "@material-ui/core";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/home.css";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

class Home extends Component {
  state = {
    list: [],
    activeItem: {
      title: "",
      note: "",
    },
    open: false,
    inputTitle: "",
    inputNote: "",
    changedTitle: "",
    changedNote: "",
  };
  componentDidMount = () => {
    AOS.init({ duration: 300 });
    var x = localStorage.getItem("list");
    if (x != null) {
      this.setState({ list: JSON.parse(x) });
    }
  };
  openItem = (obj) => {
    console.log(obj);
    this.setState({ open: true });
    this.setState({
      activeItem: {
        title: obj["e"]["title"],
        note: obj["e"]["note"],
      },
      changedNote: obj["e"]["note"],
      changedTitle: obj["e"]["title"],
    });
  };
  addItem = () => {
    if (
      (this.state.inputNote !== "" && this.state.inputNote.indexOf(" ") != 0) ||
      (this.state.inputTitle !== "" && this.state.inputTitle.indexOf(" ") != 0)
    ) {
      var list = this.state.list;
      var x = {
        title: this.state.inputTitle,
        note: this.state.inputNote,
      };
      list.unshift(x);
      localStorage.setItem("list", JSON.stringify(this.state.list));
      this.setState({ inputNote: "", inputTitle: "" });
    }
  };
  removeItem = () => {
    var list = this.state.list.filter(
      (e) => e.note != this.state.activeItem.note
    );
    localStorage.setItem("list", JSON.stringify(list));
    this.setState({ list });
    this.handleDialog();
  };
  resetItem = () => {
    var list = this.state.list;
    for (var e = 0; e < list.length; e++) {
      if (
        list[e].title == this.state.activeItem.title &&
        list[e].note == this.state.activeItem.note
      ) {
        list[e].note = this.state.changedNote;
        list[e].title = this.state.changedTitle;
      }
    }

    this.setState({ list });
    localStorage.setItem("list", JSON.stringify(list));
    this.handleDialog();
  };
  handleDialog = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <>
        <Paper className="input-paper" elevation={2}>
          <input
            type="text"
            placeholder="Title"
            className="title-input"
            style={{ border: "none" }}
            value={this.state.inputTitle}
            onChange={(e) => {
              this.setState({ inputTitle: e.target.value });
            }}
          />

          <textarea
            className="para-input"
            placeholder="Take a Note"
            value={this.state.inputNote}
            onChange={(e) => {
              this.setState({ inputNote: e.target.value });
            }}
          />
          <Fab
            color="primary"
            size="small"
            className="fab"
            onClick={this.addItem}
          >
            <AddIcon size="small" />{" "}
          </Fab>
        </Paper>
        <div className="notes-wrapper">
          <FlipMove
            appearAnimation="accordionVertical"
            leaveAnimation="elevator"
            duration="400"
            staggerDelayBy={400}
          >
            <Grid className="notes-grid" container spacing={2}>
              {this.state.list.map((e) => (
                <Grid item xs={7} md={3} sm>
                  <Paper
                    key={e["title"]}
                    elevation={2}
                    className="saved-note-paper"
                    onClick={() => {
                      this.openItem({ e });
                    }}
                  >
                    <Typography
                      variant="h6"
                      className="saved-title"
                      style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                      gutterBottom
                    >
                      {e.title}
                    </Typography>
                    <Typography variant="body1" className="saved-note">
                      {e.note}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </FlipMove>
        </div>
        <Dialog
          open={this.state.open}
          fullWidth
          maxWidth="xs"
          className="dialog"
          onClose={this.handleDialog}
          data-aos="fade"
        >
          <DialogContent className="dialog-content">
            <input
              type="text"
              placeholder="Title"
              className="title-input"
              style={{ border: "none" }}
              defaultValue={this.state.activeItem.title}
              onChange={(e) => {
                this.setState({ changedTitle: e.target.value });
              }}
            />
            <textarea
              className="para-input"
              defaultValue={this.state.activeItem.note}
              placeholder="Note"
              onChange={(e) => {
                this.setState({ changedNote: e.target.value });
              }}
            />
            <IconButton
              size="small"
              className="delete-icon"
              style={{ marginTop: "0px", marginBottom: "5px" }}
              onClick={this.removeItem}
            >
              <DeleteIcon size="small" />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              className="done-btn"
              style={{
                position: "absolute",
                right: "15px",
                bottom: "15px",
                fontSize: "0.7rem",
                padding: "4px 6px",
                textTransform: "capitalize",
              }}
              onClick={this.resetItem}
            >
              Done
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default Home;
