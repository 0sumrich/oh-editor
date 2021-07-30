SELECT * from opening_hours
WHERE updated = (SELECT MAX(updated) FROM opening_hours);