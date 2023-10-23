# Instructions:
# You need to replace the the variables below with your own credentials.
# Use envsubst to replace the variables in the file.
# Source a .env file with the variables or export them in your shell.
# You can use the following command to generate the file. 
# Assuming you have a .env file in the current directory.
# source ../../.env && envsubst < vertex-install.tape > vertex-install-creds.tape
Require palette
Output vertex-install.mp4

Set FontSize 14
Set Width 950
Set Height 500
Set TypingSpeed 0.1
Set WindowBar Colorful
Set Margin 20
Set BorderRadius 10

Show
Type "palette ec install"
Enter
Sleep 3s
Down 1
Enter
Sleep 2s
Type "y"
Sleep 2s
Type "${UBUNTU_PRO}" # Ubuntu Pro Token. This is not required for a normal Palette installation.
Enter
Type "${PROD_FIPS_SCAR_URL}"
Enter
Type@200ms "username"
Hide
Backspace 15
Type "${PROD_FIPS_SCAR_USERNAME}"
Enter
Show
Sleep 2s
Type "${PROD_FIPS_SCAR_PASSWORD}" # FIPS Packs Repository Password
Enter
Sleep 2s
Type "y" # Allow Insecure Connection
Sleep 2s
Enter
Sleep 3s
Enter # Select VMware vSphere
Sleep 2s
Enter  # Cluster Name
Sleep 2s
Enter  # HTTPS Proxy
Sleep 2s
Enter  # HTTP Proxy
Sleep 2s
Escape
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
Type "y" # Use default pack registry
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
Type "y" # Allow insecure connection
Enter
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
Enter
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
Type "${NON_AIRGAP_IP_START_RANGE}" # IP Start Range
Enter
Sleep 2s
Type "${NON_AIRGAP_IP_END_RANGE}" # IP End Range
Enter
Sleep 2s
Enter # Network Prefix
Sleep 2s
Type "${NON_AIRGAP_GATEWAY}" # Gateway
Enter
Type "${NON_AIRGAP_DNS_SERVER}" # DNS Server
Enter
Type "spectrocloud.dev" # Name Server Domain
Enter
Sleep 2s
Down 1 # Medium VM Size
Enter
Sleep 2s
Type "y" # Node Affinity
Enter

Sleep 35s