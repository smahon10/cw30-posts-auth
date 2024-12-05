import type { Context, Next } from "hono";
import { lucia } from "../db/auth";

const DEBUG = false;

export const auth = async (c: Context, next: Next) => {
  const cookie = c.req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);

  DEBUG && console.log("auth middleware is called!", { sessionId }); 

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  DEBUG && console.log("auth middleware", { session, user }); 

  if (!session) {
    const blankSessionCookie = lucia.createBlankSessionCookie();
    c.header("Set-Cookie", blankSessionCookie.serialize(), {
      append: true,
    });
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });
  }

  c.set("session", session);
  c.set("user", user);
  return next();
};
