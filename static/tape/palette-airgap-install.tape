# Instructions:
# You need to replace the the variables below with your own credentials.
# Use envsubst to replace the variables in the file.
# Source a .env file with the variables or export them in your shell.
# You can use the following command to generate the file. 
# Assuming you have a .env file in the current directory.
# source ../../.env && envsubst < palette-airgap-install.tape > palette-airgap-install-creds.tape
Require palette
Output palette-airgap-install.mp4

Set FontSize 14
Set Width 950
Set Height 500
Set TypingSpeed 0.1
Set WindowBar Colorful
Set Margin 20
Set BorderRadius 10


Show
Type "palette ec install"
Sleep 5s
Enter
Sleep 1s
Enter
Type "y"
Sleep 2s
Type "${UBUNTU_PRO}" # Ubuntu Pro Token. This is not required for a normal Palette installation.
Enter
Type "${AIRGAP_FILE_SERVER}" # Specify File Server
Sleep 2s
Enter
Type "admin" # Username
Sleep 2s
Enter
Type "admin" # Password
Sleep 2s
Enter
Type "y" # Allow insecure connection
Sleep 4s
Enter # Select VMware
Sleep 2s
Enter # Cluster Name
Sleep 2s
Type "http://10.10.180.0:3128" # HTTPS Proxy
Sleep 2s
Enter
Type "http://10.10.180.0:3128" # HTTP Proxy
Sleep 2s
Enter
Escape
Type "dd"
Type "dd"
Type "dd"
Type "i"
Type "10.10.128.10"
Enter
Type ".spectrocloud.dev"
Enter
Type "10.0.0.0/8"
Escape
Sleep 2s
Type ":wq"
Sleep 2s
Enter
Sleep 2s
Enter # Proxy CA Cert
Sleep 2s
Enter # POD CIDR
Sleep 2s
Enter # Service IP Range
Sleep 2s
Enter # OCI Registry Choice
Sleep 2s
Type "Airgap Packs OCI"
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY}" # OCI Registry URL
Enter
Sleep 2s
Type "${AIRGAP_PACKS_REPOSITORY}" # Base Path
Enter
Sleep 4s
Escape
Type ":wq"
Sleep 2s
Enter
Sleep 2s
Type "n" # Allow insecure connection
Sleep 2s
Type "/tmp/oci-airgap.crt" # OCI Registry CA Cert
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY_USERNAME}" # Username
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY_PASSWORD}" # Password
Enter
Sleep 2s
Type "n"
Sleep 2s
Sleep 2s
Type "n"
Sleep 2s
Type "Airgap Images OCI"
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY}" # OCI Registry URL
Enter
Sleep 2s
Type "${AIRGAP_IMAGES_REPOSITORY}" # Base Path
Enter
Sleep 2s
Escape
Type ":wq"
Sleep 2s
Enter
Sleep 2s
Type "n" # Allow insecure connection
Sleep 2s
Type "/tmp/oci-airgap.crt" # OCI Registry CA Cert
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY_USERNAME}" # Username
Enter
Sleep 2s
Type "${AIRGAP_OCI_REGISTRY_PASSWORD}" # Password
Enter
Sleep 2s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 2s
Type "${VCENTER_USER}"
Enter
Sleep 2s
Type "${VCENTER_PASSWORD}"
Enter
Sleep 2s
Type "n" # Allow insecure connection
Sleep 4s
Enter # Select Datacenter
Sleep 3s
Type "sp-karl" # Select Folder
Enter
Sleep 3s
Down 1
Enter # Select Cluster
Sleep 3s
Down 1 # VM Network
Enter
Sleep 4s
Enter # Resource Pool
Sleep 3s
Enter # Storage Policy
Sleep 3s
Enter # Select Datastore
Sleep 2s
Type "n" # Add another fault domain
Sleep 2s 
Enter # NTP Servers
Sleep 2s
Type "dd"
Type "i"
Type "ssh-rsa AAAAB3NzaC1yc2EAA...."
Escape
Sleep 3s
Type@500ms ":wq"
Enter
Sleep 2s
Type "${AIRGAP_IP_START_RANGE}" # IP Start Range
Enter
Sleep 2s
Type "${AIRGAP_IP_END_RANGE}" # IP End Range
Enter
Sleep 2s
Enter # Network Prefix
Sleep 2s
Type "${AIRGAP_GATEWAY}" # Gateway
Enter
Type "${AIRGAP_DNS_SERVER}" # DNS Server
Enter
Type "spectrocloud.dev" # Name Server Domain
Enter
Sleep 2s
Down 1 # Medium VM Size
Enter
Sleep 2s
Type "y" # Node Affinity


Sleep 35s