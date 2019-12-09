FROM pkosiec/mongo-seeding:3.0.0

WORKDIR /data-import/

COPY . /data-import/

# Install external dependencies
RUN yarn install --production

# Set environmental variables

ENV DB_NAME votUCA
ENV DROP_DATABASE true
ENV TRANSPILE_ONLY true

# Set default workdir to simplify running the image
WORKDIR /data-import/data