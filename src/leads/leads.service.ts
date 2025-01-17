import { Injectable } from '@nestjs/common';
    import * as sqlite3 from 'sqlite3';

    @Injectable()
    export class LeadsService {
      private db: sqlite3.Database;

      constructor() {
        this.db = new sqlite3.Database(':memory:');
        this.db.serialize(() => {
          this.db.run('CREATE TABLE leads (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, organization TEXT, status TEXT)');
        });
      }

      findAll() {
        return new Promise((resolve, reject) => {
          this.db.all('SELECT * FROM leads', [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      }

      create(lead: any) {
        return new Promise((resolve, reject) => {
          this.db.run('INSERT INTO leads (first_name, last_name, email, organization, status) VALUES (?, ?, ?, ?, ?)', [lead.first_name, lead.last_name, lead.email, lead.organization, lead.status], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.lastID });
            }
          });
        });
      }

      findOne(id: string) {
        return new Promise((resolve, reject) => {
          this.db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
      }

      update(id: string, lead: any) {
        return new Promise((resolve, reject) => {
          this.db.run('UPDATE leads SET first_name = ?, last_name = ?, email = ?, organization = ?, status = ? WHERE id = ?', [lead.first_name, lead.last_name, lead.email, lead.organization, lead.status, id], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: this.changes });
            }
          });
        });
      }

      remove(id: string) {
        return new Promise((resolve, reject) => {
          this.db.run('DELETE FROM leads WHERE id = ?', [id], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes });
            }
          });
        });
      }
    }
