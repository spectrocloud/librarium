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
Enter 1
Sleep 3s
# Palette VerteX
Down 1
Sleep 1s
Enter
Sleep 2s
Enter 1
Sleep  2s
Type "y"
Sleep 2s
# Ubuntu Pro Token. This is not required for a normal Palette installation.
Type "${UBUNTU_PRO}" 
Enter 1
Type "${PROD_FIPS_SCAR_URL}"
Enter
Type@200ms "username"
Hide
Backspace 15
Type "${PROD_FIPS_SCAR_USERNAME}"
Enter 1
Show
Sleep 2s
# FIPS Packs Repository Password
Type "${PROD_FIPS_SCAR_PASSWORD}" 
Enter
Sleep 2s
# Allow Insecure Connection
Type "y" 
Sleep 2s
Enter 1
Sleep 3s
# Select VMware vSphere
Enter
Sleep 2s
# Cluster Name
Enter
Sleep 2s
# HTTPS Proxy
Enter 
Sleep 2s
# HTTP Proxy
Enter
Sleep 2s
# POD CIDR
Enter
Sleep 2s
# Use default pack registry
Type "y"
Enter 1
Sleep 2s
Type "vcenter.spectrocloud.dev"
Enter
Sleep 2s
Type "${VCENTER_USER}"
Enter 1
Sleep 2s
Type "${VCENTER_PASSWORD}"
Enter
Sleep 2s
# Allow insecure connection
Type "y"
Sleep 5s
# Select Datacenter
Enter 
Sleep 4s
# Select Folder
Type "sp-karl" 
Enter 1
Sleep 3s
Type "spectro-templates"
Sleep 1s
Enter
# Select Cluster
Enter 
Sleep 3s
# VM-NETWORK
Down 1
Sleep 1s
Enter 1
Sleep 4s
# Resource Pool
Down 1
Enter 
Sleep 3s
# Storage Policy
Enter 
Sleep 3s
# Select Datastore
Enter 
Sleep 2s
# Add another fault domain
Type "n"
Sleep 3s
Enter
Sleep 2s
Type "dd"
Type "i"
Type@10ms "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDCawOoc0B3UMrOrydXn7VC+f9gJytuE0gIrm8RHow/NDIkQnzqIQPbbjxOr39vSCirNcXWqqDFsfeitfavzFKnFQf0UdfK9XivLY1nw1fpImZrGzVoyCUef44lsFr3M8+CcTDvmPybOvZH1nmJxP39BuzsmcqrFTzw5BLj0j391QxiP68K7iOOfSrpJlditBwq55++CQ8fwqdvEOLd/ebjEt1rZ6AXPV8k3pvkuWAfRJAZ+LelXFcN6/RNb8brdIrW/IllAHTspb7VlvOoKtOpqsy3dp7Rom0WlxlkZwbiFmbxAOL7UpvDLBMtDMchYqQekthD+/Lkm5VK+w2RZbyJ"
Escape
Sleep 3s
Type@500ms ":wq"
Enter 1
Sleep 2s
# IP Start Range
Type "${NON_AIRGAP_IP_START_RANGE}"
Enter
Sleep 2s
# IP End Range
Type "${NON_AIRGAP_IP_END_RANGE}"
Enter 1
Sleep 2s
# Network Prefix
Enter 
Sleep 2s
# Gateway
Type "${NON_AIRGAP_GATEWAY}" 
Enter
# DNS Server
Type "${NON_AIRGAP_DNS_SERVER}"
Enter
# Name Server Domain
Type "spectrocloud.dev" 
Enter
Sleep 2s
# Medium VM Size
Down 1 
Enter 1
Sleep 2s
# Node Affinity
Type "y" 
Enter

Sleep 35s