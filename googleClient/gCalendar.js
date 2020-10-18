const { google } = require("googleapis");
const moment = require("moment");
const uuid = require("uuid");

class gCalendar {
  constructor(oAuth2Client) {
    this.calendar = google.calendar;
    this.calendar = this.calendar({ version: "v3", auth: oAuth2Client });
  }

  updateAuth2Client(oAuth2Client) {
    this.calendar = google.calendar;

    this.calendar = this.calendar({ version: "v3", auth: oAuth2Client });
  }

  async getCalendars(simple = false) {
    try {
      const items = (await this.calendar.calendarList.list()).data.items;
      if (simple)
        return items.map((calendar) => new Calendar(calendar).toJSON());
      return items;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getEvents(calendarId, timeMin, timeMax, simple = true) {
    try {
      const items = (
        await this.calendar.events.list({
          calendarId,
          timeMin: moment.unix(timeMin).format(),
          timeMax: moment.unix(timeMax).format(),
          timeZone: "Asia/Ho_Chi_Minh",
          singleEvents: true,
          maxAttendees: 1,
        })
      ).data.items;

      if (simple) return items.map((event) => new Event(event).toJSON());
      return items;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getEvent(calendarId, eventId) {
    try {
      return (
        await this.calendar.events.get({
          calendarId,
          eventId,
        })
      ).data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async subscribeEvent(calendarId, endpoint, id = uuid.v1()) {
    try {
      return (
        await this.calendar.events.watch({
          calendarId,
          requestBody: {
            id: id,
            type: "web_hook",
            address: endpoint,
          },
        })
      ).data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async unsubcribeEvent(req) {
    try {
      return (await this.calendar.channels.stop({ requestBody: req })).data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}

class Calendar {
  constructor(calendar) {
    this.kind = calendar.kind;
    this.id = calendar.id;
    this.summary = calendar.summary;
    this.timeZone = calendar.timeZone;
    this.colorId = calendar.colorId;
    this.backgroundColor = calendar.backgroundColor;
    this.foregroundColor = calendar.foregroundColor;
    this.accessRole = calendar.accessRole;
  }

  toJSON() {
    return {
      kind: this.kind,
      id: this.id,
      summary: this.summary,
      timeZone: this.timeZone,
      colorId: this.colorId,
      backgroundColor: this.backgroundColor,
      foregroundColor: this.foregroundColor,
      accessRole: this.accessRole,
    };
  }
}

class Event {
  constructor(event) {
    this.kind = event.kind;
    this.id = event.id;
    this.status = event.status;
    this.htmlLink = event.htmlLink;
    this.created = event.created;
    this.updated = event.updated;
    this.summary = event.summary;
    this.start = event.start.dateTime;
    this.end = event.end.dateTime;
  }

  toJSON() {
    return {
      kind: this.kind,
      id: this.id,
      status: this.status,
      htmlLink: this.htmlLink,
      created: this.created,
      updated: this.updated,
      summary: this.summary,
      start: this.start,
      end: this.end,
    };
  }
}

module.exports = new gCalendar();
