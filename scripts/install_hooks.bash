#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

echo "Installing hooks..."
# this command creates symlink to our pre-commit script
# ln -s ../../scripts/pre-commit.bash $GIT_DIR/hooks/pre-commit
cp  ./pre-push.sh $GIT_DIR/hooks/pre-push
chmod +x $GIT_DIR/hooks/pre-push
echo "Done w/ chmod!"
