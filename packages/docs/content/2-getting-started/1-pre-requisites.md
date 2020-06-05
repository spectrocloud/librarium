---
title: "Pre-requisites"
metaTitle: "Pre-requisites"
metaDescription: "Spectro Cloud page listing the pre-requisites for deploying Kubernetes clusters on various CSPs"
---

# Pre-requisites

Since Spectro Cloud interfaces with a user's existing CSP accounts to enable a faster and easier deployment, it follows that the user is required to have an operational account with all the CSPs which are to be used.

Addtional requirements specific to CSPs are detailed below.

# For AWS

1. The account should have the following privileges:
    * ABC
    * DEF
    * GHI

2. You will need to have key pairs created locally like [here.](https://www.ssh.com/ssh/keygen/#creating-an-ssh-key-pair-for-user-authentication) Please ensure that both the key files (*.pub and *.pem) are located and stored in an accessible folder.
    P.S.: If you see a *.pub but no *.pem, rename the file to add the .pem extension.

3. An active AWS cloud account with the key pairs created by [importing your keys.](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#how-to-generate-your-own-key-and-import-it-to-aws)
