from datetime import datetime
import pandas as pd
from os import path, getenv
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import glob
load_dotenv()

# warning - will delete the whole opening hours table first
def _setup_railway_db(csv_filename):
    engine = create_engine(getenv('DATABASE_URL'))
    with engine.connect() as con:
        con.execute(text('drop table opening_hours;'))
        create_sql = open('db_setup/create_opening_hours.sql').read()
        con.execute(text(create_sql))
    fn = path.join(csv_filename)
    df = pd.read_csv(fn).assign(updated=datetime(2019,8,31))
    df.index.name='id'
    df.to_sql(name='opening_hours', con=engine, index=False, if_exists='append')
    df = pd.read_sql('select * from opening_hours', con=engine)
    print(df)

def _add_more_files(dn):
    engine = create_engine(getenv('DATABASE_URL'))
    def _add_updated(s):
        date_string = s.split('\\')[-1].replace('opening hours ', '').replace('.csv','')
        return datetime.strptime(date_string, '%Y-%m-%d')
    df = pd.concat([pd.read_csv(fn).assign(updated = lambda x: _add_updated(fn)) for fn in glob.glob(path.join(dn, '*.csv')) if 'opening hours' in fn and '2019-08-31' not in fn])
    df.index.name='id'
    df.to_sql(name='opening_hours', con=engine, index=False, if_exists='append')
    df = pd.read_sql('select * from opening_hours', con=engine)
    print(df)