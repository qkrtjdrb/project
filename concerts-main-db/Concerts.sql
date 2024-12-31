ALTER USER 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS concerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

INSERT INTO concerts (name, image_url, start_date, end_date)
VALUES
    ("Concert A", "https://i.namu.wiki/i/CblvoRG8uxKo1pCjDMhj6eZByeosLSiSy6BPR3BsrdvVct85IEZXm_icYS3tNRDiZvFS70li7XpYZrwnVNXpUA.webp", "2024-12-01", "2024-12-02"),
    ("Concert B", "https://i.namu.wiki/i/b1ypas7D78WjHzxwvvZ4HxkGGfVYJVocZovqYqnrBQAm_knfVvKYGNFay6cjXx3uhiEuoVW2rD6O81Yzsg6YUw.webp", "2024-12-05", "2024-12-06");

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concert_id INT NOT NULL,
  seat VARCHAR(50) NOT NULL,
  FOREIGN KEY (concert_id) REFERENCES concerts(id)
);
ALTER TABLE reservations
ADD UNIQUE (concert_id, seat);