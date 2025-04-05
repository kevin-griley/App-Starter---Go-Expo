output "instance_id" {
  description = "ID of the API EC2 instance"
  value       = aws_instance.api_instance.id
}

output "instance_public_ip" {
  description = "Public IP of the API as provided by the Elastic IP"
  value       = aws_eip.api_eip.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the API EC2 instance"
  value       = aws_instance.api_instance.public_dns
}