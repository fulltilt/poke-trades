-- on creation of a new User, create a public Wish List Card list and a private Collection Card list
CREATE OR REPLACE FUNCTION create_initial_lists() 
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   INSERT INTO poketrades_card_list (name, user_id, is_private, is_sub_list)
   VALUES ('Collection', NEW.id, TRUE, FALSE);
   INSERT INTO poketrades_card_list (name, user_id, is_private, is_sub_list)
   VALUES ('Wish List', NEW.id, FALSE, FALSE);
   RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER create_new_users_list
AFTER INSERT
ON poketrades_user
FOR EACH ROW
EXECUTE PROCEDURE create_initial_lists();


-- after a User enters a username, create a public Card list with name [username]_TradeList
CREATE OR REPLACE FUNCTION create_list() 
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   INSERT INTO poketrades_card_list (name, user_id, is_private, is_sub_list)
   VALUES (NEW.username || '_TradeList', OLD.id, FALSE, FALSE);
   RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER create_public_list
AFTER UPDATE
OF username
ON poketrades_user
FOR EACH ROW
EXECUTE PROCEDURE create_list();


-- after a User requests a trade, send receiving a Notification
CREATE OR REPLACE FUNCTION create_notification() 
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   INSERT INTO poketrades_notification (sender_id, recipient_id, message)
   VALUES (NEW.user_id, NEW.other_user_id, 'You have a new trade request from user ' || NEW.username);
   RETURN NEW;
END;
$$; 

CREATE OR REPLACE TRIGGER after_trade_insert
AFTER INSERT
ON poketrades_trade
FOR EACH ROW
EXECUTE PROCEDURE create_notification();


-- once each User confirms a trade, increment each User's trade count by 1
CREATE OR REPLACE FUNCTION update_trades() 
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   UPDATE poketrades_user
   SET completed_trades = completed_trades + 1
   WHERE id = NEW.user_id;
   UPDATE poketrades_user
   SET completed_trades = completed_trades + 1
   WHERE id = NEW.other_user_id;
   RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER update_trades
AFTER UPDATE OF user_status, other_user_status
ON poketrades_trade
FOR EACH ROW
WHEN (NEW.user_status = 4 AND NEW.other_user_status = 4)
EXECUTE PROCEDURE update_trades();